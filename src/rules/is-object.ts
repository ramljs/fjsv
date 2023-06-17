import { RequiredSome } from 'ts-gems';
import {
  Context, isValidator, kValidatorFn, Nullish, Type,
  ValidationOptions, Validator, validator
} from '../core/index.js';

export type PropertyOptions = { label?: string, as?: string };
export type ObjectSchema =
    Record<string | number,
        Validator<any, any> | [Validator<any, any>, PropertyOptions]
    >;

export interface IsObjectOptions<T> extends ValidationOptions {
  name?: string;
  ctor?: Type<T>,
  additionalFields?: boolean | Validator<any, any>;
  caseInSensitive?: boolean;
  detectCircular?: boolean;
}

export interface ObjectValidator<T extends object = object, I = object> extends Validator<T, I> {
  schema: ObjectSchema;
}

/**
 * Validates object according to schema
 * Converts properties according to schema rules if coerce option is set to 'true'.
 * @validator isObject
 */
export function isObject<T extends object = object, I = object>(
    schema: ObjectSchema,
    options?: IsObjectOptions<T>
): ObjectValidator<T, I> {
  const ctor = options?.ctor;
  const ctorName = options?.name || ctor?.name;
  const additionalFields = options?.additionalFields ?? false;
  const caseInSensitive = !!options?.caseInSensitive;
  const detectCircular = !!options?.detectCircular;
  if (options) {
    delete options.name;
    delete options.ctor;
    delete options.additionalFields;
    delete options.caseInSensitive;
    delete options.detectCircular;
  }

  const propertyRules: Record<any, Validator<any, any>> = {};
  const propertyOptions: Record<any, RequiredSome<PropertyOptions, 'as'>> = {}
  Object.keys(schema).forEach(k => {
    const n = schema[k];
    const key = caseInSensitive ? k.toLowerCase() : k;
    if (Array.isArray(n)) {
      if (!isValidator(n[0]))
        throw new TypeError(`Invalid tuple definition in validation schema (${k})`);
      propertyRules[key] = n[0];
      propertyOptions[key] = {as: k, ...n[1]};
    } else if (isValidator(n)) {
      propertyRules[key] = n;
      propertyOptions[key] = {as: k};
    } else
      throw new TypeError(`Invalid definition in validation schema (${k})`);
  })
  const schemaKeys = Object.keys(propertyRules);

  const _rule = validator<T, object>('isObject',
      function (
          input: object | undefined,
          context: Context & { circMap?: Map<object, object> }
      ): Nullish<T> {
        if (!(input && typeof input === 'object')) {
          context.failure(`{{label}} must be an object`);
          return;
        }
        const keyMap = [...Object.keys(input), ...schemaKeys]
            .reduce((a, k) => {
              if (caseInSensitive)
                a[k.toLowerCase()] = k;
              else a[k] = k;
              return a;
            }, {} as any);
        const keys = Object.keys(keyMap);
        const l = keys.length;
        let i = 0;
        let inputKey: string;
        let schemaKey: string;
        let v: any;
        let _propRule: Validator<any, any> | undefined;

        const out: any = {};
        if (ctor)
          Object.setPrototypeOf(out, ctor.prototype);
        if (detectCircular) {
          context.circMap = context.circMap || new Map<object, object>();
          if (context.circMap.has(input))
            return context.circMap.get(input) as any;
          context.circMap.set(input, out);
        }

        const rootName = context.root?.input.context;
        const location = context.input.location || '';

        // Iterate object keys and perform rules
        for (i = 0; i < l; i++) {
          inputKey = keys[i];
          schemaKey = keyMap[inputKey];
          v = input[inputKey];
          _propRule = propertyRules[schemaKey] ||
              (isValidator(additionalFields) ? additionalFields : undefined)

          if (_propRule) {
            const subCtx = context.extend(_propRule);
            if (ctorName) {
              if (rootName && rootName !== ctorName)
                subCtx.input.root = rootName;
              subCtx.input.context = ctorName;
            }
            subCtx.input.value = v;
            subCtx.input.label = propertyOptions[schemaKey]?.label || schemaKey;
            subCtx.input.location = location + (location ? '.' : '') + schemaKey;
            subCtx.input.property = schemaKey;
            v = _propRule[kValidatorFn](v, subCtx, _propRule);
          } else if (v !== undefined && !additionalFields)
            context.failure(`${ctorName || 'Object'} does not accept additional fields`);

          if (v !== undefined)
            out[propertyOptions[schemaKey]?.as || schemaKey] = v;
        }
        return context.errors.length ? undefined : out;
      }, options
  ) as unknown as ObjectValidator<T, I>;

  _rule.schema = schema;
  return _rule;
}
