import { isNull, isNullish } from 'valgen';

describe('isNull', () => {
  it('should validate value is null', () => {
    expect(isNull(null)).toStrictEqual(null);
    expect(() => isNull(undefined)).toThrow('"undefined" is not null');
    expect(() => isNull('' as any)).toThrow('"" is not null');
    expect(() => isNull(5 as any)).toThrow('"5" is not null');
    expect(() => isNull(NaN as any)).toThrow('"NaN" is not null');
  });
});

describe('isNullish', () => {
  it('should validate value is null', () => {
    expect(isNullish(null)).toStrictEqual(null);
    expect(isNullish(undefined)).toStrictEqual(undefined);
    expect(() => isNullish('' as any)).toThrow('"" is not nullish');
    expect(() => isNullish(5 as any)).toThrow('"5" is not nullish');
    expect(() => isNullish(NaN as any)).toThrow('"NaN" is not nullish');
  });
});
