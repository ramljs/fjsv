import { Nullish } from 'ts-gems';
import validatorJS from 'validator';
import { Context, ValidationOptions, validator } from '../core/index.js';


/**
 * Validates if value is an "UUID".
 * @validator isUUID
 */
export function isUUID(
    version?: 1 | 2 | 3 | 4 | 5,
    options?: ValidationOptions
) {
  return validator<string, string>('isUUID',
      function (input: unknown, context: Context): Nullish<string> {
        if (input != null && typeof input === 'string' && validatorJS.isUUID(input, version))
          return input;
        context.failure(`{{label}} is not a valid UUID${version ? ' v' + version : ''}`);
      }, options
  )
}


export interface IsEmailOptions extends ValidationOptions, validatorJS.IsEmailOptions {
}

/**
 * Validates if value is a valid Email
 * @validator isEmail
 */
export function isEmail(options?: IsEmailOptions) {
  return validator<string, string>('isEmail',
      function (input: unknown, context: Context): Nullish<string> {
        if (typeof input === 'string' && validatorJS.isEmail(input, options))
          return input;
        context.failure(`{{label}} is not a valid a EMail`);
      }, options
  );
}


export interface IsMobilePhoneOptions extends ValidationOptions, validatorJS.IsMobilePhoneOptions {
  locale?: 'any' | validatorJS.MobilePhoneLocale | validatorJS.MobilePhoneLocale[]
}

/**
 * Validates if value is a valid Email
 * @validator isMobilePhone
 */
export function isMobilePhone(options?: IsMobilePhoneOptions) {
  return validator<string, string>('isMobilePhone',
      function (input: unknown, context: Context): Nullish<string> {
        if (typeof input === 'string' && validatorJS.isMobilePhone(input, options?.locale, options))
          return input;
        context.failure(`{{label}} is not a valid a Mobile Phone Number`);
      }, options
  );
}


/**
 * Validates if value is an IP
 * @validator isIP
 */
export function isIP(
    version?: 4 | 6,
    options?: ValidationOptions
) {
  return validator<string, string>('isIP',
      function (input: unknown, context: Context): Nullish<string> {
        if (input != null && typeof input === 'string' && validatorJS.isIP(input, version))
          return input;
        context.failure(`{{label}} is not a valid IP${version ? ' v' + version : ''}`);
      }, options
  )
}

/**
 * Validates if value is an IP
 * @validator isUUID
 */
export function isIPRange(
    version?: 4 | 6,
    options?: ValidationOptions
) {
  return validator<string, string>('isIPRange',
      function (input: unknown, context: Context): Nullish<string> {
        if (input != null && typeof input === 'string' && validatorJS.isIPRange(input, version))
          return input;
        context.failure(`{{label}} is not a valid IP${version ? ' v' + version : ''} range`);
      }, options
  )
}

export interface IsMACAddressOptions extends ValidationOptions, validatorJS.IsMACAddressOptions {
}

/**
 * Validates if value is an MACAddress
 * @validator isMACAddress
 */
export function isMACAddress(
    options?: IsMACAddressOptions
) {
  return validator<string, string>('isMACAddress',
      function (input: unknown, context: Context): Nullish<string> {
        if (input != null && typeof input === 'string' && validatorJS.isMACAddress(input, options))
          return input;
        context.failure(`{{label}} is not a valid MAC address`);
      }, options
  )
}

/**
 * Validates if value is a port number
 * @validator isPort
 */
export function isPort(options?: ValidationOptions) {
  return validator<string, string>('isPort',
      function (input: unknown, context: Context): Nullish<string> {
        if (input != null && typeof input === 'string' && validatorJS.isPort(input))
          return input;
        context.failure(`{{label}} is not a valid port number`);
      }, options
  )
}

export interface IsURLOptions extends ValidationOptions, validatorJS.IsURLOptions {
}

/**
 * Validates if value is an MACAddress
 * @validator isURL
 */
export function isURL(
    options?: IsURLOptions
) {
  return validator<string, string>('isURL',
      function (input: unknown, context: Context): Nullish<string> {
        if (input != null && typeof input === 'string' && validatorJS.isURL(input, options))
          return input;
        context.failure(`{{label}} is not a valid URL`);
      }, options
  )
}

export interface Base64ValidatorOptions extends ValidationOptions, validatorJS.IsBase64Options {
}

/**
 * Validates if value is a "Base64" string.
 * @validator isBase64
 */
export function isBase64(options?: Base64ValidatorOptions) {
  return validator<string, string>('isBase64',
      function (input: unknown, context: Context): Nullish<string> {
        if (typeof input === 'string' && validatorJS.isBase64(input, options))
          return input;
        context.failure(`{{label}} is not a valid a Base64 string`);
      }, options
  );
}


/**
 * Validates if value is a BIC (Bank Identification Code) or SWIFT code
 * @validator isBIC
 */
export function isBIC(options?: ValidationOptions) {
  return validator<string, string>('isBIC',
      function (input: unknown, context: Context): Nullish<string> {
        if (typeof input === 'string' && validatorJS.isBIC(input))
          return input;
        context.failure(`{{label}}is not a valid a BIC (Bank Identification Code) or SWIFT code`);
      }, options
  );
}


export interface CreditCardValidatorOptions extends ValidationOptions, validatorJS.IsCreditCardOptions {
}

/**
 * Validates if value is a "Base64" formatted string.
 * @validator isCreditCard
 */
export function isCreditCard(options?: CreditCardValidatorOptions) {
  return validator<string, string>('isCreditCard',
      function (input: unknown, context: Context): Nullish<string> {
        if (typeof input === 'string' && validatorJS.isCreditCard(input, options))
          return input;
        context.failure(`{{label}} is not a valid Credit Card number`);
      }, options
  );
}

/**
 * Validates if value is an IBAN (International Bank Account Number)
 * @validator isEAN
 */
export function isIBAN(options?: ValidationOptions) {
  return validator<string, string>('isIBAN',
      function (input: unknown, context: Context): Nullish<string> {
        if (typeof input === 'string' && validatorJS.isIBAN(input))
          return input;
        context.failure(`{{label}} is not a valid IBAN (International Bank Account Number)`);
      }, options
  );
}


/**
 * Validates if value is an passport number
 * @validator isPassportNumber
 */
export function isPassportNumber(countryCode: string, options?: ValidationOptions) {
  return validator<string, string>('isPassportNumber',
      function (input: unknown, context: Context): Nullish<string> {
        if (typeof input === 'string' && validatorJS.isPassportNumber(input, countryCode))
          return input;
        context.failure(`{{label}} is not a valid ${countryCode} PassportNumber)`);
      }, options
  );
}

/**
 * Validates if value is an EAN (European Article Number)
 * @validator isEAN
 */
export function isEAN(options?: ValidationOptions) {
  return validator<string, string>('isEAN',
      function (input: unknown, context: Context): Nullish<string> {
        if (typeof input === 'string' && validatorJS.isEAN(input))
          return input;
        context.failure(`{{label}} is not a valid EAN (European Article Number)`);
      }, options
  );
}

export interface IsFQDNOptions extends ValidationOptions, validatorJS.IsFQDNOptions {
}

/**
 * Validates if value is an FQDN
 * @validator isFQDN
 */
export function isFQDN(options?: IsFQDNOptions) {
  return validator<string, string>('isFQDN',
      function (input: unknown, context: Context): Nullish<string> {
        if (typeof input === 'string' && validatorJS.isFQDN(input, options))
          return input;
        context.failure(`{{label}} is not valid FQDN`);
      }, options
  );
}

export interface IsISSNOptions extends ValidationOptions, validatorJS.IsISSNOptions {
}

/**
 * Validates if value is an ISSN
 * @validator isISSN
 */
export function isISSN(options?: IsISSNOptions) {
  return validator<string, string>('isISSN',
      function (input: unknown, context: Context): Nullish<string> {
        if (typeof input === 'string' && validatorJS.isISSN(input, options))
          return input;
        context.failure(`{{label}} is not a valid ISSN`);
      }, options
  );
}

/**
 * Validates if value is an VAT number
 * @validator isVAT
 */
export function isVAT(countryCode: string, options?: IsISSNOptions) {
  return validator<string, string>('isVAT',
      function (input: unknown, context: Context): Nullish<string> {
        if (typeof input === 'string' && validatorJS.isVAT(input, countryCode))
          return input;
        context.failure(`{{label}} is not a valid VAT number`);
      }, options
  );
}

/**
 * Validates if value is a BTC address.
 * @validator isBtcAddress
 */
export function isBtcAddress(options?: ValidationOptions) {
  return validator<string, string>('isBtcAddress',
      function (input: unknown, context: Context): Nullish<string> {
        if (typeof input === 'string' && validatorJS.isBtcAddress(input))
          return input;
        context.failure(`{{label}} is not a valid a BTC address`);
      }, options
  );
}


/**
 * Validates if value is a ETH (Ethereum) address.
 * @validator isBtcAddress
 */
export function isETHAddress(options?: ValidationOptions) {
  return validator<string, string>('isETHAddress',
      function (input: unknown, context: Context): Nullish<string> {
        if (typeof input === 'string' && validatorJS.isEthereumAddress(input))
          return input;
        context.failure(`{{label}} is not a valid a ETH (Ethereum) address`);
      }, options
  );
}


export type HashAlgorithm = 'crc32' | 'crc32b' | 'md4' | 'md5' | 'ripemd128' |
    'ripemd160' | 'sha1' | 'sha256' | 'sha384' | 'sha512' |
    'tiger128' | 'tiger160' | 'tiger192'

/**
 * Validates if value a hash of type algorithm
 * @validator isHash
 */
export function isHash(algorithm: HashAlgorithm, options?: ValidationOptions) {
  return validator<string, string>('isHash',
      function (input: unknown, context: Context): Nullish<string> {
        if (typeof input === 'string' && validatorJS.isHash(input, algorithm))
          return input;
        context.failure(`{{label}} is not a valid ${algorithm} hash`);
      }, options
  );
}

/**
 * Validates if value is a Hex Color
 * @validator isHexColor
 */
export function isHexColor(options?: ValidationOptions) {
  return validator<string, string>('isHexColor',
      function (input: unknown, context: Context): Nullish<string> {
        if (typeof input === 'string' && validatorJS.isHexColor(input))
          return input;
        context.failure(`{{label}} is not a valid Hex Color`);
      }, options
  );
}


/**
 * Validates if value a valid JWT token
 * @validator isHash
 */
export function isJWT(options?: ValidationOptions) {
  return validator<string, string>('isJWT',
      function (input: unknown, context: Context): Nullish<string> {
        if (typeof input === 'string' && validatorJS.isJWT(input))
          return input;
        context.failure(`{{label}} is not a valid JWT token`);
      }, options
  );
}


/**
 * Validates if value a Lowercase string
 * @validator isLowercase
 */
export function isLowercase(options?: ValidationOptions) {
  return validator<string, string>('isLowercase',
      function (input: unknown, context: Context): Nullish<string> {
        if (typeof input === 'string' && validatorJS.isLowercase(input))
          return input;
        context.failure(`{{label}} is not a lowercase string`);
      }, options
  );
}

/**
 * Validates if value a Uppercase string
 * @validator isUppercase
 */
export function isUppercase(options?: ValidationOptions) {
  return validator<string, string>('isLowercase',
      function (input: unknown, context: Context): Nullish<string> {
        if (typeof input === 'string' && validatorJS.isUppercase(input))
          return input;
        context.failure(`{{label}} is not an uppercase string`);
      }, options
  );
}
