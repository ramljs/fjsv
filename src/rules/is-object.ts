import { RequiredSome } from 'ts-gems';
import { postValidation, preValidation } from '../constants.js';
import {
  Context, isValidator, Nullish, Type,
  ValidationOptions, Validator as Validator_, validator
} from '../core/index.js';

export namespace IsObject {
  export interface Validator<T extends object = object, I = object> extends Validator_<T, I> {
    schema: Schema;
  }

  export type PropertyOptions = { label?: string, as?: string };
  export type Schema = Record<string | number, Validator_ | [Validator_, PropertyOptions]>;

  export interface Options<T> extends ValidationOptions {
    name?: string;
    ctor?: Type<T>,
    additionalFields?: boolean | Validator_ | 'error';
    caseInSensitive?: boolean;
    detectCircular?: boolean;
  }

}


/**
 * Validates object according to schema
 * Converts properties according to schema rules if coerce option is set to 'true'.
 * @validator isObject
 */
export function isObject<T extends object = object, I = object | string>(
    schema?: IsObject.Schema,
    options?: IsObject.Options<T>
): IsObject.Validator<T, I> {
  const ctor = options?.ctor;
  const ctorName = options?.name || ctor?.name;
  const additionalFields = options?.additionalFields ?? !schema;
  const caseInSensitive = !!options?.caseInSensitive;
  const detectCircular = !!options?.detectCircular;
  const propertyRules: Record<any, Validator_> = {};
  const propertyOptions: Record<any, RequiredSome<IsObject.PropertyOptions, 'as'>> = {};
  schema = schema || {};
  const schemaKeys = Object.keys(schema);
  for (const k of schemaKeys) {
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
  }

  const _rule = validator<T, object>('isObject',
      function (
          input: any,
          context: Context & { circMap?: Map<object, object> },
          _this
      ): Nullish<T> {
        if (ctor && ctor[preValidation])
          input = ctor[preValidation](input, context, _this);

        const coerce = options?.coerce || context.coerce;
        if (typeof input === 'string' && coerce)
          input = JSON.parse(input);

        if (!(input && typeof input === 'object')) {
          context.fail(_this, `{{label}} must be an object`, input);
          return;
        }

        const keys = [...Object.keys(input), ...schemaKeys];
        const l = keys.length;
        let i = 0;
        let inputKey: string;
        let schemaKey: string;
        let v: any;
        let _propRule: Validator_ | undefined;

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
        if (context.errors.length)
          return undefined;

        if (ctor && ctor[postValidation]) {
          ctor[postValidation](out, context, _this);
          return out;
        }

        return out;
      }, options
  ) as unknown as IsObject.Validator<T, I>;

  _rule.schema = schema;
  return _rule;
}
