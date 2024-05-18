import { Context, Nullish, ValidationOptions, Validator, validator } from '../../core/index.js';

/**
 * Validates record object according to given "key" and "value" rules
 * Converts properties according to rules if coerce option is set to 'true'.
 * @validator isRecord
 */
export function isRecord<TKeys extends string | number | symbol, TValues>(
  keyRule: Validator<TKeys>,
  valueRule: Validator<TValues>,
  options?: ValidationOptions,
) {
  return validator<Record<TKeys, TValues>>(
    'isRecord',
    function (input: object | undefined, context: Context, _this): Nullish<Record<TKeys, TValues>> {
      if (!(input && typeof input === 'object')) {
        context.fail(_this, `{{label}} must be an object`, input);
        return;
      }
      const keyContext = context.extend();
      const valueContext = context.extend();
      const location = context.location || '';
      const keys = Object.keys(input);
      const l = keys.length;
      let i: number;
      let k: any;
      let v: any;
      const out: any = {};
      for (i = 0; i < l; i++) {
        k = keys[i];
        v = input[k];
        // Validate key
        keyContext.property = '@' + k;
        keyContext.location = location + (location ? '.@' : '@') + k;
        k = keyRule(k, keyContext);
        // Validate value
        valueContext.property = k;
        valueContext.location = location + (location ? '.' : '') + k;
        v = valueRule(v, valueContext);
        out[k] = v;
      }
      return context.errors.length ? undefined : out;
    },
    options,
  );
}
