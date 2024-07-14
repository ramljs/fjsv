import { isNotNull, isNotNullish, isNull, isNullish } from 'valgen';

describe('isNull', () => {
  it('should validate value is null', () => {
    expect(isNull(null)).toStrictEqual(null);
    expect(() => isNull(undefined)).toThrow('Value is not null');
    expect(() => isNull('' as any)).toThrow('Value is not null');
    expect(() => isNull(5 as any)).toThrow('Value is not null');
    expect(() => isNull(NaN as any)).toThrow('Value is not null');
  });
});

describe('isNotNull', () => {
  it('should validate value is not null', () => {
    expect(isNotNull(0)).toStrictEqual(0);
    expect(isNotNull(undefined)).toStrictEqual(undefined);
    expect(isNotNull('')).toStrictEqual('');
    expect(isNotNull(NaN)).toStrictEqual(NaN);
    expect(() => isNotNull(null)).toThrow('Value is null');
  });
});

describe('isNullish', () => {
  it('should validate value is null', () => {
    expect(isNullish(null)).toStrictEqual(null);
    expect(isNullish(undefined)).toStrictEqual(undefined);
    expect(() => isNullish('' as any)).toThrow('Value is not nullish');
    expect(() => isNullish(5 as any)).toThrow('Value is not nullish');
    expect(() => isNullish(NaN as any)).toThrow('Value is not nullish');
  });
});

describe('isNotNullish', () => {
  it('should validate value is not null', () => {
    expect(isNotNullish(0)).toStrictEqual(0);
    expect(isNotNullish('')).toStrictEqual('');
    expect(isNotNullish(NaN)).toStrictEqual(NaN);
    expect(() => isNotNullish(null)).toThrow('Value is null');
    expect(() => isNotNullish(undefined)).toThrow('Value is undefined');
  });
});
