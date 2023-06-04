import { $boolean, $isBoolean } from 'valgen';

describe("boolean", function () {

  /*
   *
   */
  describe("boolean", function () {
    it("should return undefined if nullish", function () {
      expect($boolean(null)).toStrictEqual(undefined);
      expect($boolean(undefined)).toStrictEqual(undefined);
    });

    it("should transform any value to boolean", function () {
      expect($boolean(true)).toStrictEqual(true);
      expect($boolean(false)).toStrictEqual(false);
      expect($boolean(1)).toStrictEqual(true);
      expect($boolean(0)).toStrictEqual(false);
      expect($boolean('1')).toStrictEqual(true);
      expect($boolean('0')).toStrictEqual(true);
      expect($boolean(NaN)).toStrictEqual(false);
    });

  });

  /*
   *
   */
  describe("isBoolean", function () {
    it("should validate value is a boolean", function () {
      expect($isBoolean(true)).toStrictEqual(true);
      expect($isBoolean(false)).toStrictEqual(false);
    });

    it("should throw if validation fails", function () {
      expect(() => $isBoolean(5 as any)).toThrow('must be a boolean');
      expect(() => $isBoolean(null as any)).toThrow('must be a boolean');
      expect(() => $isBoolean(NaN as any)).toThrow('must be a boolean');
    });
  });

});
