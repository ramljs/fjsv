import { vg } from 'valgen';

/*
 *
 */
describe('isGt', function () {
  it('should validate number value is greater than minValue', function () {
    expect(vg.isGt(5)(6)).toStrictEqual(6);
    expect(() => vg.isGt(5)(5)).toThrow('must be greater than 5');
    expect(() => vg.isGt(5)('x' as any)).toThrow('must be greater than 5');
  });

  it('should validate bigint value is greater than minValue', function () {
    expect(vg.isGt(BigInt(5))(BigInt(6))).toStrictEqual(BigInt(6));
    expect(vg.isGt(BigInt(5))(6)).toStrictEqual(6);
    expect(() => vg.isGt(BigInt(5))(BigInt(5))).toThrow('must be greater than 5');
    expect(() => vg.isGt(BigInt(5))(5)).toThrow('must be greater than 5');
    expect(() => vg.isGt(BigInt(5))('x' as any)).toThrow('must be greater than 5');
  });

  it('should validate Date value is greater than minValue', function () {
    const minDate = new Date('2020-06-01T10:00:00');
    expect(vg.isGt(minDate)(new Date('2020-06-02T10:00:00'))).toStrictEqual(new Date('2020-06-02T10:00:00'));
    expect(() => vg.isGt(minDate)(minDate)).toThrow('must be greater than');
    expect(() => vg.isGt(minDate)(new Date('2020-05-01T10:00:00'))).toThrow('must be greater than');
    expect(() => vg.isGt(minDate)('x' as any)).toThrow('must be greater than');
  });

  it('should validate string value is greater than minValue', function () {
    expect(vg.isGt('B')('C')).toStrictEqual('C');
    expect(() => vg.isGt('B')('A')).toThrow('must be greater than "B"');
    expect(() => vg.isGt('B')('B')).toThrow('must be greater than "B"');
    expect(() => vg.isGt('b')('C')).toThrow('must be greater than "b"');
    expect(() => vg.isGt('B')(5 as any)).toThrow('must be greater than "B"');
  });

  it('should validate string value is greater than minValue - caseInsensitive', function () {
    expect(vg.isGt('b', { caseInsensitive: true })('C')).toStrictEqual('C');
  });
});

/*
 *
 */
describe('isGte', function () {
  it('should validate number value is greater or equal to than minValue', function () {
    expect(vg.isGte(5)(6)).toStrictEqual(6);
    expect(vg.isGte(5)(5)).toStrictEqual(5);
    expect(() => vg.isGte(5)(4)).toThrow('must be greater than or equal to 5');
    expect(() => vg.isGte(5)('x' as any)).toThrow('must be greater than or equal to 5');
  });

  it('should validate bigint value is greater or equal to than minValue', function () {
    expect(vg.isGte(BigInt(5))(BigInt(6))).toStrictEqual(BigInt(6));
    expect(vg.isGte(BigInt(5))(BigInt(5))).toStrictEqual(BigInt(5));
    expect(vg.isGte(BigInt(5))(6)).toStrictEqual(6);
    expect(vg.isGte(BigInt(5))(5)).toStrictEqual(5);
    expect(() => vg.isGte(BigInt(5))(BigInt(4))).toThrow('must be greater than or equal to 5');
    expect(() => vg.isGte(BigInt(5))(4)).toThrow('must be greater than or equal to 5');
    expect(() => vg.isGte(BigInt(5))('x' as any)).toThrow('must be greater than or equal to 5');
  });

  it('should validate Date value is greater than or equal to minValue', function () {
    const minDate = new Date('2020-06-01T10:00:00');
    expect(vg.isGte(minDate)(new Date('2020-06-02T10:00:00'))).toStrictEqual(new Date('2020-06-02T10:00:00'));
    expect(vg.isGte(minDate)(minDate)).toStrictEqual(minDate);
    expect(() => vg.isGte(minDate)(new Date('2020-05-01T10:00:00'))).toThrow('must be greater than');
    expect(() => vg.isGte(minDate)('x' as any)).toThrow('must be greater than');
  });

  it('should validate string value is greater than or equal to minValue', function () {
    expect(vg.isGte('B')('B')).toStrictEqual('B');
    expect(vg.isGte('B')('C')).toStrictEqual('C');
    expect(() => vg.isGte('B')('A')).toThrow('must be greater than or equal to "B"');
    expect(() => vg.isGte('b')('C')).toThrow('must be greater than or equal to "b"');
    expect(() => vg.isGte('B')(5 as any)).toThrow('must be greater than or equal to "B"');
  });

  it('should validate string value is greater than or equal to minValue - caseInsensitive', function () {
    expect(vg.isGte('abc', { caseInsensitive: true })('ABD')).toStrictEqual('ABD');
    expect(vg.isGte('abc', { caseInsensitive: true })('ABC')).toStrictEqual('ABC');
  });
});

/*
 *
 */
describe('isLt', function () {
  it('should validate number value is lover than maxValue', function () {
    expect(vg.isLt(5)(4)).toStrictEqual(4);
    expect(() => vg.isLt(5)(5)).toThrow('must be lover than 5');
    expect(() => vg.isLt(5)('x' as any)).toThrow('must be lover than 5');
  });

  it('should validate bigint value is lover than maxValue', function () {
    expect(vg.isLt(BigInt(5))(BigInt(4))).toStrictEqual(BigInt(4));
    expect(vg.isLt(BigInt(5))(4)).toStrictEqual(4);
    expect(() => vg.isLt(BigInt(5))(BigInt(5))).toThrow('must be lover than 5');
    expect(() => vg.isLt(BigInt(5))(5)).toThrow('must be lover than 5');
    expect(() => vg.isLt(BigInt(5))('x' as any)).toThrow('must be lover than 5');
  });

  it('should validate Date value is lover than maxValue', function () {
    const maxDate = new Date('2020-06-20T10:00:00');
    expect(vg.isLt(maxDate)(new Date('2020-06-02T10:00:00'))).toStrictEqual(new Date('2020-06-02T10:00:00'));
    expect(() => vg.isLt(maxDate)(maxDate)).toThrow('must be lover than');
    expect(() => vg.isLt(maxDate)(new Date('2020-07-01T10:00:00'))).toThrow('must be lover than');
    expect(() => vg.isLt(maxDate)('x' as any)).toThrow('must be lover than');
  });

  it('should validate string value is lover than maxValue', function () {
    expect(vg.isLt('B')('A')).toStrictEqual('A');
    expect(vg.isLt('c')('A')).toStrictEqual('A');
    expect(() => vg.isLt('B')('B')).toThrow('must be lover than "B"');
    expect(() => vg.isLt('B')('a')).toThrow('must be lover than "B"');
    expect(() => vg.isLt('B')(5 as any)).toThrow('must be lover than "B"');
  });

  it('should validate string value is lover than maxValue - caseInsensitive', function () {
    expect(vg.isLt('b', { caseInsensitive: true })('A')).toStrictEqual('A');
  });
});

/*
 *
 */
describe('isLte', function () {
  it('should validate number value is lover than or equal to maxValue', function () {
    expect(vg.isLte(5)(4)).toStrictEqual(4);
    expect(vg.isLte(5)(5)).toStrictEqual(5);
    expect(() => vg.isLte(5)(6)).toThrow('must be lover than or equal to 5');
    expect(() => vg.isLte(5)('x' as any)).toThrow('must be lover than or equal to 5');
  });

  it('should validate bigint value is lover than or equal to maxValue', function () {
    expect(vg.isLte(BigInt(5))(BigInt(4))).toStrictEqual(BigInt(4));
    expect(vg.isLte(BigInt(5))(4)).toStrictEqual(4);
    expect(vg.isLte(BigInt(5))(BigInt(5))).toStrictEqual(BigInt(5));
    expect(vg.isLte(BigInt(5))(5)).toStrictEqual(5);
    expect(() => vg.isLte(BigInt(5))(BigInt(6))).toThrow('must be lover than or equal to 5');
    expect(() => vg.isLte(BigInt(5))(6)).toThrow('must be lover than or equal to 5');
    expect(() => vg.isLte(BigInt(5))('x' as any)).toThrow('must be lover than or equal to 5');
  });

  it('should validate Date value is lover than or equal to maxValue', function () {
    const maxDate = new Date('2020-06-20T10:00:00');
    expect(vg.isLte(maxDate)(new Date('2020-06-02T10:00:00'))).toStrictEqual(new Date('2020-06-02T10:00:00'));
    expect(vg.isLte(maxDate)(maxDate)).toStrictEqual(maxDate);
    expect(() => vg.isLte(maxDate)(new Date('2020-07-01T10:00:00'))).toThrow('must be lover than or equal to');
    expect(() => vg.isLte(maxDate)('x' as any)).toThrow('must be lover than or equal to');
  });

  it('should validate string value is lover than or equal to maxValue', function () {
    expect(vg.isLte('B')('A')).toStrictEqual('A');
    expect(vg.isLte('B')('B')).toStrictEqual('B');
    expect(vg.isLte('c')('A')).toStrictEqual('A');
    expect(() => vg.isLte('B')('a')).toThrow('must be lover than or equal to "B"');
    expect(() => vg.isLte('B')(5 as any)).toThrow('must be lover than or equal to "B"');
  });

  it('should validate string value is lover than or equal to maxValue - caseInsensitive', function () {
    expect(vg.isLte('b', { caseInsensitive: true })('A')).toStrictEqual('A');
  });
});

describe('lengthMin', function () {
  it('should validate the length is at least minValue', function () {
    expect(vg.lengthMin(3)('1234')).toStrictEqual('1234');
    expect(vg.lengthMin(3)('123')).toStrictEqual('123');
    expect(vg.lengthMin(3)([1, 2, 3, 4])).toStrictEqual([1, 2, 3, 4]);
    expect(() => vg.lengthMin(3)('ab')).toThrow('The length of Value must be at least 3');
    expect(() => vg.lengthMin(3)([1, 2])).toThrow('The length of Value must be at least 3');
  });
});

describe('lengthMax', function () {
  it('should validate the length is at most maxValue', function () {
    expect(vg.lengthMax(3)('12')).toStrictEqual('12');
    expect(vg.lengthMax(3)('123')).toStrictEqual('123');
    expect(vg.lengthMax(3)([1, 2, 3])).toStrictEqual([1, 2, 3]);
    expect(() => vg.lengthMax(3)('1245')).toThrow('The length of Value must be at most 3');
    expect(() => vg.lengthMax(3)([1, 2, 3, 4])).toThrow('The length of Value must be at most 3');
  });
});
