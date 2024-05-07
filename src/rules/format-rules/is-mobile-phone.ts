import { Nullish } from 'ts-gems';
import * as validatorJS from 'validator';
import { Context, ValidationOptions, validator } from '../../core/index.js';

export interface IsMobilePhoneOptions extends ValidationOptions {
  /**
   * If this is set to `true`, the mobile phone number must be supplied with the country code and therefore must start with `+`.
   *
   * @default false
   */
  strictMode?: boolean;

  /**
   * Locale or locales of the mobile phone
   * @default 'any'
   */
  locale?: 'any' | validatorJS.MobilePhoneLocale | validatorJS.MobilePhoneLocale[];
}

/**
 * Validates if value is a valid Email
 * @validator isMobilePhone
 */
export function isMobilePhone(options?: IsMobilePhoneOptions) {
  const opts: validatorJS.IsMobilePhoneOptions = {
    strictMode: options?.strictMode,
  };
  return validator<string, string>(
    'isMobilePhone',
    function (input: unknown, context: Context, _this): Nullish<string> {
      if (typeof input === 'string' && validatorJS.isMobilePhone(input, options?.locale, opts)) return input;
      context.fail(_this, `"{{value}}" is not a valid a Mobile Phone Number`, input);
    },
    options,
  );
}
