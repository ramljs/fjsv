import { isNull, isNumber, vg } from 'valgen';

describe('union', () => {
  it('should return one of valid values', () => {
    const c = vg.union([isNull, isNumber]);
    expect(c(6)).toStrictEqual(6);
    expect(c(null)).toStrictEqual(null);
    expect(() => c('x' as any)).toThrow(
      "Value didn't match any on union rules",
    );
  });
});
