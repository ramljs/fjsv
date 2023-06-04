import { $array, $arrayLength, $boolean, $isArray, $number, $string } from 'valgen';

describe("array", function () {

  /*
   *
   */
  describe("array", function () {
    it("should return undefined if nullish", function () {
      expect($array($string)(null)).toStrictEqual(undefined);
      expect($array($string)(undefined)).toStrictEqual(undefined);
    });

    it("should transform any value according to nested codec", function () {
      expect($array($boolean)(true)).toStrictEqual([true]);
      expect($array($string)(false)).toStrictEqual(['false']);
      expect($array($number)([1, 2])).toStrictEqual([1, 2]);
    });

  });

  /*
   *
   */
  describe("isArray", function () {
    it("should validate value is a boolean", function () {
      expect($isArray([true])).toStrictEqual([true]);
      expect($isArray([1])).toStrictEqual([1]);
    });

    it("should throw if validation fails", function () {
      expect(() => $isArray(5 as any)).toThrow('must be an array');
      expect(() => $isArray(null as any)).toThrow('must be an array');
      expect(() => $isArray(NaN as any)).toThrow('must be an array');
    });
  });

  /*
   *
   */
  describe("arrayLength", function () {
    it("should return array length", function () {
      expect($arrayLength([5, 6, 7])).toStrictEqual(3);
      expect($arrayLength([])).toStrictEqual(0);
    });

    it("should throw if validation fails", function () {
      expect(() => $arrayLength(5 as any)).toThrow('must be an array');
      expect(() => $arrayLength(null as any)).toThrow('must be an array');
      expect(() => $arrayLength(NaN as any)).toThrow('must be an array');
    });
  });

});
