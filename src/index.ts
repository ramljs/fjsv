import * as factories from './rules/index.js';

const isAny = factories.isAny();
const isArray = factories.isArray();
const isBigint = factories.isBigint();
const isBoolean = factories.isBoolean();
const isDate = factories.isDate();
const isDateString = factories.isDateString();
const isEmpty = factories.isEmpty();
const isNotEmpty = factories.isNotEmpty();
const isInteger = factories.isInteger();
const isNull = factories.isNull();
const isNullish = factories.isNullish();
const isDefined = factories.isDefined();
const isUndefined = factories.isUndefined();
const isNumber = factories.isNumber();
const isObject = factories.isObject();
const isObjectId = factories.isObjectId();
const isString = factories.isString();
const isUUID = factories.isUUID();
const isUUID1 = factories.isUUID(1);
const isUUID2 = factories.isUUID(2);
const isUUID3 = factories.isUUID(3);
const isUUID4 = factories.isUUID(4);
const isUUID5 = factories.isUUID(5);
const isEmail = factories.isEmail();
const isMobilePhone = factories.isMobilePhone();
const isIP = factories.isIP();
const isIPRange = factories.isIPRange();
const isMACAddress = factories.isMACAddress();
const isPort = factories.isPort();
const isURL = factories.isURL();
const isBase64 = factories.isBase64();
const isBIC = factories.isBIC();
const isCreditCard = factories.isCreditCard();
const isIBAN = factories.isIBAN();
const isEAN = factories.isEAN();
const isFQDN = factories.isFQDN();
const isISSN = factories.isISSN();
const isBtcAddress = factories.isBtcAddress();
const isETHAddress = factories.isETHAddress();
const isHexColor = factories.isHexColor();
const isJWT = factories.isJWT();
const isLowercase = factories.isLowercase();
const isUppercase = factories.isUppercase();

export * from './core/index.js';

export {
  factories,
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
  isUppercase
}
