import { isDefined } from 'valgen';

describe('isDefined', () => {
  it('should validate value is defined', () => {
    expect(isDefined(0)).toStrictEqual(0);
    expect(isDefined(null)).toStrictEqual(null);
    expect(isDefined('')).toStrictEqual('');
    expect(() => isDefined(undefined)).toThrow('Is not defined');
  });
});
