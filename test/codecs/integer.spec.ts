import { $integer, $isInteger } from 'valgen';

describe("integer", function () {

  /*
   *
   */
  describe("integer", function () {

    it("should return undefined if nullish", function () {
      expect($integer(null)).toStrictEqual(undefined);
      expect($integer(undefined)).toStrictEqual(undefined);
    });

    it("should validate number value", function () {
      expect($integer(1)).toStrictEqual(1);
    });

    it("should transform string value to number", function () {
      expect($integer('1')).toStrictEqual(1);
    });

    it("should throw if string is not a valid number", function () {
      expect(() => $integer('a1')).toThrow('not a valid integer number');
      expect(() => $integer(1.2)).toThrow('not a valid integer number');
    });

  });


  /*
   *
   */
  describe("isInteger", function () {
    it("should validate value is an integer", function () {
      expect($isInteger(4)).toStrictEqual(4);
      expect($isInteger(3.0)).toStrictEqual(3);
    });

    it("should throw if validation fails", function () {
      expect(() => $isInteger(6.1)).toThrow('"6.1" is not a valid integer value');
      expect(() => $isInteger('x' as any)).toThrow('"x" is not a valid integer value');
    });
  });

});
