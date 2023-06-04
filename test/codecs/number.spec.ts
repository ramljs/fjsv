import {
  $isNumber, $isNumberGt, $isNumberGte,
  $isNumberLt, $isNumberLte, $number
} from 'valgen';

describe("number", function () {

  /*
   *
   */
  describe("number", function () {

    it("should return undefined if nullish", function () {
      expect($number(null)).toStrictEqual(undefined);
      expect($number(undefined)).toStrictEqual(undefined);
    });

    it("should validate number value", function () {
      expect($number(1.3)).toStrictEqual(1.3);
    });

    it("should transform string value to number", function () {
      expect($number('4.2')).toStrictEqual(4.2);
    });

    it("should throw if string is not a valid number", function () {
      expect(() => $number('a1')).toThrow('not a valid number');
    });

  });


  /*
   *
   */
  describe("isNumber", function () {
    it("should validate value is a number", function () {
      expect($isNumber(1)).toStrictEqual(1);
      expect($isNumber(0)).toStrictEqual(0);
    });

    it("should throw if validation fails", function () {
      expect(() => $isNumber('5' as any)).toThrow('must be a number');
      expect(() => $isNumber(null as any)).toThrow('must be a number');
      expect(() => $isNumber(NaN as any)).toThrow('must be a number');
    });
  });

  /*
   *
   */
  describe("isNumberGt", function () {
    it("should validate value is greater than first argument", function () {
      expect($isNumberGt(5)(6)).toStrictEqual(6);
    });

    it("should throw if validation fails", function () {
      expect(() => $isNumberGt(5)(5)).toThrow('must be greater than 5');
      expect(() => $isNumberGt(5)('x' as any)).toThrow('must be greater than 5');
    });
  });

  /*
   *
   */
  describe("isNumberGte", function () {
    it("should validate value is greater or equal to first argument", function () {
      expect($isNumberGte(5)(5)).toStrictEqual(5);
      expect($isNumberGte(5)(6)).toStrictEqual(6);
    });

    it("should throw if validation fails", function () {
      expect(() => $isNumberGte(5)(4)).toThrow('Value must be greater than or equal to 5');
      expect(() => $isNumberGte(5)('x' as any)).toThrow('Value must be greater than or equal to 5');
    });
  });

  /*
   *
   */
  describe("isNumberLt", function () {
    it("should validate value is lover than first argument", function () {
      expect($isNumberLt(5)(4)).toStrictEqual(4);
    });

    it("should throw if validation fails", function () {
      expect(() => $isNumberLt(5)(5)).toThrow('must be lover than 5');
      expect(() => $isNumberLt(5)('x' as any)).toThrow('must be lover than 5');
    });
  });

  /*
   *
   */
  describe("isNumberLte", function () {
    it("should validate value is greater or equal to first argument", function () {
      expect($isNumberLte(5)(4)).toStrictEqual(4);
      expect($isNumberLte(5)(5)).toStrictEqual(5);
    });

    it("should throw if validation fails", function () {
      expect(() => $isNumberLte(5)(6)).toThrow('Value must be lover than or equal to 5');
      expect(() => $isNumberLte(5)('x' as any)).toThrow('Value must be lover than or equal to 5');
    });
  });

});
