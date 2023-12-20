import { factories } from 'valgen';

describe("isEnum", function () {

  it("should validate value", function () {
    expect(factories.isEnum('a')('a')).toStrictEqual('a');
    expect(factories.isEnum(['a', 'b'])('a')).toStrictEqual('a');
    expect(factories.isEnum(['a', 'b'])('b')).toStrictEqual('b');
    expect(() => factories.isEnum(['a', 'b'])('c')).toThrow('must be one of');
    expect(() => factories.isEnum(['a', 'b'])(undefined)).toThrow('must be one of');
    expect(() => factories.isEnum(['a', 'b'])(null)).toThrow('must be one of');
  });

});
