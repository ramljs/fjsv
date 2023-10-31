import { RequiredSome } from 'ts-gems';
import {
  Context, isValidator, Nullish, Type,
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
  additionalFields?: boolean | Validator<any, any> | 'error';
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
  const propertyRules: Record<any, Validator<any, any>> = {};
  const propertyOptions: Record<any, RequiredSome<PropertyOptions, 'as'>> = {};
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
  });

  const _rule = validator<T, object>('isObject',
      function (
          input: object | undefined,
          context: Context & { circMap?: Map<object, object> },
          _this
      ): Nullish<T> {
        if (!(input && typeof input === 'object')) {
          context.fail(_this, `{{label}} must be an object`, input);
          return;
        }
        const keys = [...Object.keys(input), ...Object.keys(schema)];
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

        if (context.root == null)
          context.root = context.root || ctorName || '';
        const location = context.location || '';

        const processedSchemaKeys: Record<string, boolean> = {};
        // Iterate object keys and perform rules
        for (i = 0; i < l; i++) {
          inputKey = keys[i];
          schemaKey = caseInSensitive ? inputKey.toLowerCase() : inputKey;
          v = input[inputKey];

          _propRule = propertyRules[schemaKey] ||
              (isValidator(additionalFields) ? additionalFields : undefined)
          if (_propRule) {
            if (processedSchemaKeys[schemaKey])
              continue;
            processedSchemaKeys[schemaKey] = true;
            const subCtx = context.extend();
            subCtx.scope = input;
            subCtx.context = ctorName;
            subCtx.location = location + (location ? '.' : '') + schemaKey;
            subCtx.property = schemaKey;
            if (propertyOptions[schemaKey]?.label)
              subCtx.label = propertyOptions[schemaKey]?.label;
            v = _propRule(v, subCtx);
          } else if (v !== undefined) {
            if (!additionalFields)
              continue;
            if (additionalFields === 'error')
              context.fail(_propRule,
                  `${ctorName || 'Object'} has no field '${inputKey}' and does not accept additional fields`,
                  v);
          }

          if (v !== undefined)
            out[propertyOptions[schemaKey]?.as || schemaKey] = v;
        }
        return context.errors.length ? undefined : out;
      }, options
  ) as unknown as ObjectValidator<T, I>;

  _rule.schema = schema;
  return _rule;
}
