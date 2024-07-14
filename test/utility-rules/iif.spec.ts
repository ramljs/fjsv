import { iif, isDefined, isEmpty, isNumber, isString } from 'valgen';

describe('iif', () => {
  it('should return first argument if check success, return second else', () => {
    expect(iif(isEmpty, 1, 2)('')).toStrictEqual(1);
    expect(iif(isEmpty, 1, 2)('-')).toStrictEqual(2);
  });

  it('should call first validator if check success, call second else', () => {
    expect(
      iif(isDefined, isString, isNumber)(1, { coerce: true }),
    ).toStrictEqual('1');
    expect(
      iif(isEmpty, isString, isNumber)('2', { coerce: true }),
    ).toStrictEqual(2);
  });
});
