import * as vg from './rules/index.js';

export * from './constants.js';
export * from './core/index.js';
export { IsObject } from './rules/type-rules/is-object.js';

const isAny = vg.isAny();
const isArray = vg.isArray();
const isBigint = vg.isBigint();
const isBoolean = vg.isBoolean();
const isDate = vg.isDate();
const isDateString = vg.isDateString();
const isEmpty = vg.isEmpty();
const isNotEmpty = vg.isNotEmpty();
const isInteger = vg.isInteger();
const isNull = vg.isNull();
const isNullish = vg.isNullish();
const isDefined = vg.isDefined();
const isUndefined = vg.isUndefined();
const isNumber = vg.isNumber();
const isObject = vg.isObject();
const isObjectId = vg.isObjectId();
const isString = vg.isString();
const isUUID = vg.isUUID();
const isUUID1 = vg.isUUID(1);
const isUUID2 = vg.isUUID(2);
const isUUID3 = vg.isUUID(3);
const isUUID4 = vg.isUUID(4);
const isUUID5 = vg.isUUID(5);
const isEmail = vg.isEmail();
const isMobilePhone = vg.isMobilePhone();
const isIP = vg.isIP();
const isIPRange = vg.isIPRange();
const isMACAddress = vg.isMACAddress();
const isPort = vg.isPort();
const isURL = vg.isURL();
const isBase64 = vg.isBase64();
const isSWIFT = vg.isSWIFT();
const isCreditCard = vg.isCreditCard();
const isIBAN = vg.isIBAN();
const isEAN = vg.isEAN();
const isFQDN = vg.isFQDN();
const isISSN = vg.isISSN();
const isBtcAddress = vg.isBtcAddress();
const isETHAddress = vg.isETHAddress();
const isHexColor = vg.isHexColor();
const isJWT = vg.isJWT();
const isLowercase = vg.isLowercase();
const isUppercase = vg.isUppercase();
const isAlpha = vg.isAlpha();
const isAlphanumeric = vg.isAlphanumeric();
const isAscii = vg.isAscii();
const isDecimal = vg.isDecimal();
const isHex = vg.isHex();

const toArray = vg.isArray(isAny, { coerce: true });
const toBoolean = vg.isBoolean({ coerce: true });
const toDate = vg.isDate({ coerce: true });
const toBigint = vg.isBigint({ coerce: true });
const toDateString = vg.isDateString({ coerce: true });
const toInteger = vg.isInteger({ coerce: true });
const toNumber = vg.isNumber({ coerce: true });
const toString = vg.isString({ coerce: true });

export {
  isAlpha,
  isAlphanumeric,
  isAny,
  isArray,
  isAscii,
  isBase64,
  isBigint,
  isBoolean,
  isBtcAddress,
  isCreditCard,
  isDate,
  isDateString,
  isDecimal,
  isDefined,
  isEAN,
  isEmail,
  isEmpty,
  isETHAddress,
  isFQDN,
  isHex,
  isHexColor,
  isIBAN,
  isInteger,
  isIP,
  isIPRange,
  isISSN,
  isJWT,
  isLowercase,
  isMACAddress,
  isMobilePhone,
  isNotEmpty,
  isNull,
  isNullish,
  isNumber,
  isObject,
  isObjectId,
  isPort,
  isString,
  isSWIFT,
  isUndefined,
  isUppercase,
  isURL,
  isUUID,
  isUUID1,
  isUUID2,
  isUUID3,
  isUUID4,
  isUUID5,
  toArray,
  toBigint,
  toBoolean,
  toDate,
  toDateString,
  toInteger,
  toNumber,
  toString,
  vg,
};
