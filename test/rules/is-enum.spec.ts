import { isEnum } from 'valgen';

describe("isEnum", function () {

  it("should validate value", function () {
    expect(isEnum('a')('a')).toStrictEqual('a');
    expect(isEnum(['a', 'b'])('a')).toStrictEqual('a');
    expect(isEnum(['a', 'b'])('b')).toStrictEqual('b');
    expect(() => isEnum(['a', 'b'])('c')).toThrow('must be one of');
    expect(() => isEnum(['a', 'b'])(undefined)).toThrow('must be one of');
    expect(() => isEnum(['a', 'b'])(null)).toThrow('must be one of');
  });

});
