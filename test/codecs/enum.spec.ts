import { $enum } from 'valgen';

describe("enum", function () {

  it("should return undefined if nullish", function () {
    expect($enum('a')(null)).toStrictEqual(undefined);
    expect($enum('a')(undefined)).toStrictEqual(undefined);
  });

  it("should validate value", function () {
    expect($enum('a')('a')).toStrictEqual('a');
    expect($enum(['a', 'b'])('a')).toStrictEqual('a');
    expect($enum(['a', 'b'])('b')).toStrictEqual('b');
  });

  it("should throw if value not in list", function () {
    expect(() => $enum(['a', 'b'])('c')).toThrow('must be one of');
  });

});
