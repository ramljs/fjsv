import {
  $isDefined, $isNotNull, $isNotNullish,
  $isNull, $isNullish, $isUndefined
} from 'valgen';

describe("null", function () {

  /*
   *
   */
  describe("isNull", function () {
    it("should validate value is null", function () {
      expect($isNull(null)).toStrictEqual(null);
    });

    it("should throw if validation fails", function () {
      expect(() => $isNull('' as any)).toThrow('must be null');
      expect(() => $isNull(5 as any)).toThrow('must be null');
      expect(() => $isNull(undefined as any)).toThrow('must be null');
      expect(() => $isNull(NaN as any)).toThrow('must be null');
    });
  });

  /*
  *
  */
  describe("isUndefined", function () {
    it("should validate value is undefined", function () {
      expect($isUndefined(undefined)).toStrictEqual(undefined);
    });

    it("should throw if validation fails", function () {
      expect(() => $isUndefined('' as any)).toThrow('must be undefined');
      expect(() => $isUndefined(5 as any)).toThrow('must be undefined');
      expect(() => $isUndefined(null as any)).toThrow('must be undefined');
      expect(() => $isUndefined(NaN as any)).toThrow('must be undefined');
    });
  });

  /*
   *
   */
  describe("isNullish", function () {
    it("should validate value is nullish", function () {
      expect($isNullish(null)).toStrictEqual(null);
      expect($isNullish(undefined)).toStrictEqual(undefined);
    });

    it("should throw if validation fails", function () {
      expect(() => $isNullish('' as any)).toThrow('must be null');
      expect(() => $isNullish(5 as any)).toThrow('must be null');
      expect(() => $isNullish(NaN as any)).toThrow('must be null');
    });
  });

  /*
   *
   */
  describe("isNotNull", function () {
    it("should validate value is not null", function () {
      expect($isNotNull(0)).toStrictEqual(0);
      expect($isNotNull(undefined)).toStrictEqual(undefined);
      expect($isNotNull('')).toStrictEqual('');
    });

    it("should throw if validation fails", function () {
      expect(() => $isNotNull(null)).toThrow('can\'t be null');
    });
  });

  /*
   *
   */
  describe("isDefined", function () {
    it("should validate value is defined", function () {
      expect($isDefined(0)).toStrictEqual(0);
      expect($isDefined(null)).toStrictEqual(null);
      expect($isDefined('')).toStrictEqual('');
    });

    it("should throw if validation fails", function () {
      expect(() => $isDefined(undefined)).toThrow('must be defined');
    });
  });

  /*
   *
   */
  describe("isNotNullish", function () {
    it("should validate value is not nullish", function () {
      expect($isNotNullish(0)).toStrictEqual(0);
      expect($isNotNullish('')).toStrictEqual('');
    });

    it("should throw if validation fails", function () {
      expect(() => $isNotNullish(null)).toThrow('can\'t be null nor undefined');
      expect(() => $isNotNullish(undefined)).toThrow('can\'t be null nor undefined');
    });
  });

});
