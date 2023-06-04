import { $boolean, $number, $string, $tuple } from 'valgen';

describe("tuple", function () {

  it("should return undefined if nullish", function () {
    expect($tuple([$string])(null)).toStrictEqual(undefined);
    expect($tuple([$string])(undefined)).toStrictEqual(undefined);
  });

  it("should transform any value according to nested codec", function () {
    expect($tuple([$string, $number, $boolean])([1, '2', 0])).toStrictEqual(['1', 2, false]);
  });

});
