import {
  $boolean,
  $isNotEmpty,
  $isString,
  $string,
  $stringReplace, $stringSplit,
  $stringTrim,
  $stringTrimEnd,
  $stringTrimStart
} from 'valgen';

describe("string", function () {

  /*
   *
   */
  describe("string", function () {

    it("should return undefined if nullish", function () {
      expect($boolean(null)).toStrictEqual(undefined);
      expect($boolean(undefined)).toStrictEqual(undefined);
    });

    it("should transform any value to string", function () {
      expect($string(1)).toStrictEqual('1');
      expect($string(0)).toStrictEqual('0');
      expect($string('1')).toStrictEqual('1');
      expect($string('0')).toStrictEqual('0');
    });

  });

  /*
   *
   */
  describe("isString", function () {
    it("should validate value is a string", function () {
      expect($isString('a')).toStrictEqual('a');
    });

    it("should throw if validation fails", function () {
      expect(() => $isString(5 as any)).toThrow('must be a string');
      expect(() => $isString(null as any)).toThrow('must be a string');
      expect(() => $isString(NaN as any)).toThrow('must be a string');
    });
  });

  /*
  *
  */
  describe("isString", function () {
    it("should validate value is a string", function () {
      expect($isNotEmpty('a')).toStrictEqual('a');
    });

    it("should throw if validation fails", function () {
      expect(() => $isNotEmpty('')).toThrow('must be a non-empty string');
      expect(() => $isNotEmpty(5 as any)).toThrow('must be a non-empty string');
      expect(() => $isNotEmpty(null as any)).toThrow('must be a non-empty string');
      expect(() => $isNotEmpty(NaN as any)).toThrow('must be a non-empty string');
    });
  });

  /*
  *
  */
  describe("stringTrim", function () {
    it("should trim string value", function () {
      expect($stringTrim(' a ')).toStrictEqual('a');
    });

    it("should throw if value is not a string", function () {
      expect(() => $stringTrim(1 as any)).toThrow('must be a string');
    });
  });


  /*
   *
   */
  describe("stringTrimStart", function () {
    it("should trim start of string value", function () {
      expect($stringTrimStart(' a ')).toStrictEqual('a ');
    });

    it("should throw if value is not a string", function () {
      expect(() => $stringTrimStart(1 as any)).toThrow('must be a string');
    });
  });

  /*
  *
  */
  describe("stringTrimEnd", function () {
    it("should trim end of string value", function () {
      expect($stringTrimEnd(' a ')).toStrictEqual(' a');
    });

    it("should throw if value is not a string", function () {
      expect(() => $stringTrimEnd(1 as any)).toThrow('must be a string');
    });
  });

  /*
   *
   */
  describe("stringReplace", function () {
    it("should process String.replace", function () {
      expect($stringReplace(/-/g, '_')('a-b')).toStrictEqual('a_b');
    });

    it("should throw if value is not a string", function () {
      expect(() => $stringReplace('', '')(1 as any)).toThrow('must be a string');
    });
  });

  /*
   *
   */
  describe("stringSplit", function () {
    it("should process String.replace", function () {
      expect($stringSplit(',')('a,b')).toStrictEqual(['a', 'b']);
    });

    it("should throw if value is not a string", function () {
      expect(() => $stringSplit(',')(1 as any)).toThrow('must be a string');
    });
  });

});
