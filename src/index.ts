import * as vg from './rules/index.js';

export * from './constants.js';
export * from './core/index.js';
export { IsObject } from './rules/is-object.js';

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
const isBIC = vg.isBIC();
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
const isHexadecimal = vg.isHexadecimal();

export {
  vg,
  isAny,
  isArray,
  isBigint,
  isBoolean,
  isDate,
  isDateString,
  isEmpty,
  isNotEmpty,
  isInteger,
  isNull,
  isNullish,
  isDefined,
  isUndefined,
  isNumber,
  isObject,
  isObjectId,
  isString,
  isUUID,
  isUUID1,
  isUUID2,
  isUUID3,
  isUUID4,
  isUUID5,
  isEmail,
  isMobilePhone,
  isIP,
  isIPRange,
  isMACAddress,
  isPort,
  isURL,
  isBase64,
  isBIC,
  isCreditCard,
  isIBAN,
  isEAN,
  isFQDN,
  isISSN,
  isBtcAddress,
  isETHAddress,
  isHexColor,
  isJWT,
  isLowercase,
  isUppercase,
  isAlpha,
  isAlphanumeric,
  isAscii,
  isDecimal,
  isHexadecimal
}
