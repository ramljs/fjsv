import { vg } from 'valgen';

describe("isEnum", function () {

  it("should validate value", function () {
    expect(vg.isEnum('a')('a')).toStrictEqual('a');
    expect(vg.isEnum(['a', 'b'])('a')).toStrictEqual('a');
    expect(vg.isEnum(['a', 'b'])('b')).toStrictEqual('b');
    expect(() => vg.isEnum(['a', 'b'])('c')).toThrow('must be one of');
    expect(() => vg.isEnum(['a', 'b'])(undefined)).toThrow('must be one of');
    expect(() => vg.isEnum(['a', 'b'])(null)).toThrow('must be one of');
  });

});
