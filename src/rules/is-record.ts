import {
  Context, kValidatorFn, Nullish,
  ValidationOptions, Validator, validator,
} from '../core/index.js';

/**
 * Validates record object according to given "key" and "value" rules
 * Converts properties according to rules if coerce option is set to 'true'.
 * @validator isRecord
 */
export function isRecord<TKeys extends string | number | symbol, TValues>(
    keyRule: Validator<TKeys>,
    valueRule: Validator<TValues>,
    options?: ValidationOptions
) {
  return validator<Record<TKeys, TValues>>('isRecord',
      function (input: object | undefined, context: Context): Nullish<Record<TKeys, TValues>> {
        if (!(input && typeof input === 'object')) {
          context.failure(`{{label}} is not an object`);
          return;
        }
        const location = context.input.location || '';
        const keyContext = context.extend(keyRule);
        const valueContext = context.extend(valueRule);
        const keys = Object.keys(input);
        const l = keys.length;
        let i: number;
        let k;
        let v;
        const out: any = {};
        for (i = 0; i < l; i++) {
          k = keys[i];
          v = input[k];

          keyContext.input.value = k;
          keyContext.input.property = '@' + k;
          keyContext.input.location = location + (location ? '.@' : '@') + k;
          k = keyRule[kValidatorFn](k, keyContext, keyRule);

          valueContext.input.value = v;
          valueContext.input.property = k;
          valueContext.input.location = location + (location ? '.' : '') + k;
          v = valueRule[kValidatorFn](v, valueContext, valueRule);
          out[k] = v;
        }
        return context.errors.length ? undefined : out;
      }, options
  )
}
