import { isUndefined } from 'valgen';

describe('isUndefined', function () {
  it('should validate value is undefined', function () {
    expect(isUndefined(undefined)).toStrictEqual(undefined);
    expect(() => isUndefined('' as any)).toThrow("Value mustn't be defined");
    expect(() => isUndefined(5 as any)).toThrow("Value mustn't be defined");
    expect(() => isUndefined(null as any)).toThrow("Value mustn't be defined");
    expect(() => isUndefined(NaN as any)).toThrow("Value mustn't be defined");
  });

  it('should coerce to undefined', function () {
    expect(isUndefined(0, { coerce: true })).not.toBeDefined();
    expect(isUndefined(1, { coerce: true })).not.toBeDefined();
    expect(isUndefined(undefined, { coerce: true })).not.toBeDefined();
    expect(isUndefined(null, { coerce: true })).not.toBeDefined();
  });
});
