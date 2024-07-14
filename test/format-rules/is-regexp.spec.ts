import { vg } from 'valgen';

describe('isRegExp', () => {
  it('should return undefined if nullish', () => {
    expect(vg.matches('\\d+')(null)).toStrictEqual(undefined);
    expect(vg.matches('\\d+')(undefined)).toStrictEqual(undefined);
  });

  it('should validate value matches given pattern', () => {
    expect(vg.matches('\\d+')('0123')).toStrictEqual('0123');
    expect(vg.matches(/\d+/)('0123')).toStrictEqual('0123');
    expect(() => vg.matches(/\d+/)('abc')).toThrow(
      'does not match requested format',
    );
    expect(() =>
      vg.matches(/\d+/, { formatName: 'positive number' })('abc'),
    ).toThrow('does not match positive number format');
  });
});
