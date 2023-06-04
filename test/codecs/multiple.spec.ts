import {
  $allOf, $boolean, $isNull, $isNumberGt,
  $isNumberLt, $number, $oneOf, $pipe, $string
} from 'valgen';

describe("multiple", function () {

  describe("pipe", function () {

    it("should return undefined if nullish", function () {
      expect($pipe([$string])(null)).toStrictEqual(undefined);
      expect($pipe([$string])(undefined)).toStrictEqual(undefined);
    });

    it("should transform any value according to nested codec", function () {
      expect($pipe([$string, $number, $boolean])(1 as any)).toStrictEqual(true);
      expect($pipe([$string, $number, $string])(1 as any)).toStrictEqual('1');
    });

  });

  describe("oneOf", function () {
    it("should return one of valid codecs", function () {
      const codec = $oneOf([$isNull, $number]);
      expect(codec(6)).toStrictEqual(6);
      expect(codec('6' as any)).toStrictEqual(6);
      expect(codec(null)).toStrictEqual(null);
      expect(() => codec('x' as any)).toThrow('match any of required format');
    });

  });

  describe("allOf", function () {
    it("should check all validation rules passes", function () {
      const codec = $allOf([$number, $isNumberGt(5), $isNumberLt(10)]);
      expect(() => codec(6)).not.toThrow();
      expect(() => codec('x')).toThrow('is not a valid number');
      expect(() => codec(5)).toThrow('must be greater than');
      expect(() => codec(10)).toThrow('must be lover than');
    });
  });

})



