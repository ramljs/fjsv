import type { Nullish } from 'ts-gems';
import validatorJS from 'validator';
import {
  type Context,
  type ValidationOptions,
  validator,
} from '../../core/index.js';

export interface IsEmailOptions extends ValidationOptions {
  /**
   * If set to `true`, the validator will also match `Display Name <email-address>`.
   *
   * @default false
   */
  allowDisplayName?: boolean;

  /**
   * If set to `true`, the validator will reject strings without the format `Display Name <email-address>`.
   *
   * @default false
   */
  requireDisplayName?: boolean;

  /**
   * If set to `false`, the validator will not allow any non-English UTF8 character in email address' local part.
   *
   * @default true
   */
  utf8LocalPart?: boolean;

  /**
   * If set to `true`, the validator will not check for the standard max length of an email.
   *
   * @default false
   */
  ignoreMaxLength?: boolean;

  /**
   * If set to `true`, the validator will allow IP addresses in the host part.
   *
   * @default false
   */
  allowIpDomain?: boolean;

  /**
   * If set to `true`, some additional validation will be enabled,
   * e.g. disallowing certain syntactically valid email addresses that are rejected by GMail.
   *
   * @default false
   */
  domainSpecificValidation?: boolean;

  /**
   *  If set to an array of strings and the part of the email after
   *  the @ symbol matches one of the strings defined in it,
   *  the validation fails.
   */
  hostBlacklist?: string[];

  /**
   * If set to an array of strings and the part of the email after
   * the @ symbol matches none of the strings defined in it,
   * the validation fails.
   */
  hostWhitelist?: string[];

  /**
   *  If set to a string, then the validator will reject emails that include
   *  any of the characters in the string, in the name part.
   */
  blacklistedChars?: string;
}

/**
 * Validates if value is a valid Email
 * @validator isEmail
 */
export function isEmail(options?: IsEmailOptions) {
  const emailOptions: validatorJS.IsEmailOptions = {
    // eslint-disable-next-line camelcase
    allow_display_name: true,
    // eslint-disable-next-line camelcase
    allow_utf8_local_part: options?.utf8LocalPart,
    // eslint-disable-next-line camelcase
    ignore_max_length: true,
    // eslint-disable-next-line camelcase
    allow_ip_domain: options?.allowIpDomain,
  };
  return validator<string, string>(
    'isEmail',
    (input: unknown, context: Context, _this): Nullish<string> => {
      if (
        typeof input === 'string' &&
        validatorJS.isEmail(input, emailOptions)
      ) {
        if (options?.requireDisplayName) {
          if (
            !validatorJS.isEmail(input, {
              ...emailOptions,
              // eslint-disable-next-line camelcase
              require_display_name: true,
            })
          ) {
            context.fail(
              _this,
              `Display name for the email is required. Etc. ( Name <me@tempuri.org> ) `,
              input,
            );
            return;
          }
        } else if (
          !options?.allowDisplayName &&
          !validatorJS.isEmail(input, {
            ...emailOptions,
            // eslint-disable-next-line camelcase
            allow_display_name: false,
          })
        ) {
          context.fail(_this, `Display name in email is not allowed`, input);
          return;
        }
        if (
          options?.hostBlacklist &&
          !validatorJS.isEmail(input, {
            ...emailOptions,
            // eslint-disable-next-line camelcase
            host_blacklist: options.hostBlacklist,
          })
        ) {
          context.fail(_this, `Email "{{value}}" is in black-list`, input);
          return;
        }
        if (
          options?.hostWhitelist &&
          !validatorJS.isEmail(input, {
            ...emailOptions,
            // eslint-disable-next-line camelcase
            host_whitelist: options.hostWhitelist,
          })
        ) {
          context.fail(_this, `Email "{{value}}" is in not white-list`, input);
          return;
        }
        if (
          options?.blacklistedChars &&
          !validatorJS.isEmail(input, {
            ...emailOptions,
            // eslint-disable-next-line camelcase
            blacklisted_chars: options.blacklistedChars,
          })
        ) {
          context.fail(
            _this,
            `Black listed characters (${options.blacklistedChars}) found in name part`,
            input,
          );
          return;
        }
        return input;
      }
      context.fail(
        _this,
        `"{{value}}" does not match required e-mail format`,
        input,
      );
    },
    options,
  );
}
