import { vg } from 'valgen';

describe('exists', function () {
  it('should validate value exists', function () {
    expect(vg.exists()(0)).toStrictEqual(0);
    expect(vg.exists()(null)).toStrictEqual(null);
    expect(() => vg.exists()(undefined)).toThrow('Value must exist');
    const objVal = vg.isObject({
      a: vg.exists(),
    });
    expect(objVal({ a: 1 })).toStrictEqual({ a: 1 });
    expect(() => objVal({})).toThrow('`a` must exist');
  });
});
