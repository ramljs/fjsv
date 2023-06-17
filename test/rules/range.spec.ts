import { isGt, isGte, isLt, isLte } from 'valgen';

/*
 *
 */
describe("isGt", function () {
  it("should validate number value is greater than minValue", function () {
    expect(isGt(5)(6)).toStrictEqual(6);
    expect(() => isGt(5)(5)).toThrow('must be greater than 5');
    expect(() => isGt(5)('x' as any)).toThrow('must be greater than 5');
  });

  it("should validate bigint value is greater than minValue", function () {
    expect(isGt(BigInt(5))(BigInt(6))).toStrictEqual(BigInt(6));
    expect(isGt(BigInt(5))(6)).toStrictEqual(6);
    expect(() => isGt(BigInt(5))(BigInt(5))).toThrow('must be greater than 5');
    expect(() => isGt(BigInt(5))(5)).toThrow('must be greater than 5');
    expect(() => isGt(BigInt(5))('x' as any)).toThrow('must be greater than 5');
  });

  it("should validate Date value is greater than minValue", function () {
    const minDate = new Date('2020-06-01T10:00:00');
    expect(isGt(minDate)(new Date('2020-06-02T10:00:00'))).toStrictEqual(new Date('2020-06-02T10:00:00'));
    expect(() => isGt(minDate)(minDate)).toThrow('must be greater than');
    expect(() => isGt(minDate)(new Date('2020-05-01T10:00:00'))).toThrow('must be greater than');
    expect(() => isGt(minDate)('x' as any)).toThrow('must be greater than');
  });

  it("should validate string value is greater than minValue", function () {
    expect(isGt('B')('C')).toStrictEqual('C');
    expect(() => isGt('B')('A')).toThrow('must be greater than "B"');
    expect(() => isGt('B')('B')).toThrow('must be greater than "B"');
    expect(() => isGt('b')('C')).toThrow('must be greater than "b"');
    expect(() => isGt('B')(5 as any)).toThrow('must be greater than "B"');
  });

  it("should validate string value is greater than minValue - caseInsensitive", function () {
    expect(isGt('b', {caseInsensitive: true})('C')).toStrictEqual('C');
  });
});

/*
 *
 */
describe("isGte", function () {
  it("should validate number value is greater or equal to than minValue", function () {
    expect(isGte(5)(6)).toStrictEqual(6);
    expect(isGte(5)(5)).toStrictEqual(5);
    expect(() => isGte(5)(4)).toThrow('must be greater than or equal to 5');
    expect(() => isGte(5)('x' as any)).toThrow('must be greater than or equal to 5');
  });

  it("should validate bigint value is greater or equal to than minValue", function () {
    expect(isGte(BigInt(5))(BigInt(6))).toStrictEqual(BigInt(6));
    expect(isGte(BigInt(5))(BigInt(5))).toStrictEqual(BigInt(5));
    expect(isGte(BigInt(5))(6)).toStrictEqual(6);
    expect(isGte(BigInt(5))(5)).toStrictEqual(5);
    expect(() => isGte(BigInt(5))(BigInt(4))).toThrow('must be greater than or equal to 5');
    expect(() => isGte(BigInt(5))(4)).toThrow('must be greater than or equal to 5');
    expect(() => isGte(BigInt(5))('x' as any)).toThrow('must be greater than or equal to 5');
  });

  it("should validate Date value is greater than or equal to minValue", function () {
    const minDate = new Date('2020-06-01T10:00:00');
    expect(isGte(minDate)(new Date('2020-06-02T10:00:00'))).toStrictEqual(new Date('2020-06-02T10:00:00'));
    expect(isGte(minDate)(minDate)).toStrictEqual(minDate);
    expect(() => isGte(minDate)(new Date('2020-05-01T10:00:00'))).toThrow('must be greater than');
    expect(() => isGte(minDate)('x' as any)).toThrow('must be greater than');
  });

  it("should validate string value is greater than or equal to minValue", function () {
    expect(isGte('B')('B')).toStrictEqual('B');
    expect(isGte('B')('C')).toStrictEqual('C');
    expect(() => isGte('B')('A')).toThrow('must be greater than or equal to "B"');
    expect(() => isGte('b')('C')).toThrow('must be greater than or equal to "b"');
    expect(() => isGte('B')(5 as any)).toThrow('must be greater than or equal to "B"');
  });

  it("should validate string value is greater than or equal to minValue - caseInsensitive", function () {
    expect(isGte('abc', {caseInsensitive: true})('ABD')).toStrictEqual('ABD');
    expect(isGte('abc', {caseInsensitive: true})('ABC')).toStrictEqual('ABC');
  });
});

/*
 *
 */
describe("isLt", function () {
  it("should validate number value is lover than maxValue", function () {
    expect(isLt(5)(4)).toStrictEqual(4);
    expect(() => isLt(5)(5)).toThrow('must be lover than 5');
    expect(() => isLt(5)('x' as any)).toThrow('must be lover than 5');
  });

  it("should validate bigint value is lover than maxValue", function () {
    expect(isLt(BigInt(5))(BigInt(4))).toStrictEqual(BigInt(4));
    expect(isLt(BigInt(5))(4)).toStrictEqual(4);
    expect(() => isLt(BigInt(5))(BigInt(5))).toThrow('must be lover than 5');
    expect(() => isLt(BigInt(5))(5)).toThrow('must be lover than 5');
    expect(() => isLt(BigInt(5))('x' as any)).toThrow('must be lover than 5');
  });

  it("should validate Date value is lover than maxValue", function () {
    const maxDate = new Date('2020-06-20T10:00:00');
    expect(isLt(maxDate)(new Date('2020-06-02T10:00:00'))).toStrictEqual(new Date('2020-06-02T10:00:00'));
    expect(() => isLt(maxDate)(maxDate)).toThrow('must be lover than');
    expect(() => isLt(maxDate)(new Date('2020-07-01T10:00:00'))).toThrow('must be lover than');
    expect(() => isLt(maxDate)('x' as any)).toThrow('must be lover than');
  });

  it("should validate string value is lover than maxValue", function () {
    expect(isLt('B')('A')).toStrictEqual('A');
    expect(isLt('c')('A')).toStrictEqual('A');
    expect(() => isLt('B')('B')).toThrow('must be lover than "B"');
    expect(() => isLt('B')('a')).toThrow('must be lover than "B"');
    expect(() => isLt('B')(5 as any)).toThrow('must be lover than "B"');
  });

  it("should validate string value is lover than maxValue - caseInsensitive", function () {
    expect(isLt('b', {caseInsensitive: true})('A')).toStrictEqual('A');
  });
});

/*
 *
 */
describe("isLte", function () {
  it("should validate number value is lover than or equal to maxValue", function () {
    expect(isLte(5)(4)).toStrictEqual(4);
    expect(isLte(5)(5)).toStrictEqual(5);
    expect(() => isLte(5)(6)).toThrow('must be lover than or equal to 5');
    expect(() => isLte(5)('x' as any)).toThrow('must be lover than or equal to 5');
  });

  it("should validate bigint value is lover than or equal to maxValue", function () {
    expect(isLte(BigInt(5))(BigInt(4))).toStrictEqual(BigInt(4));
    expect(isLte(BigInt(5))(4)).toStrictEqual(4);
    expect(isLte(BigInt(5))(BigInt(5))).toStrictEqual(BigInt(5));
    expect(isLte(BigInt(5))(5)).toStrictEqual(5);
    expect(() => isLte(BigInt(5))(BigInt(6))).toThrow('must be lover than or equal to 5');
    expect(() => isLte(BigInt(5))(6)).toThrow('must be lover than or equal to 5');
    expect(() => isLte(BigInt(5))('x' as any)).toThrow('must be lover than or equal to 5');
  });

  it("should validate Date value is lover than or equal to maxValue", function () {
    const maxDate = new Date('2020-06-20T10:00:00');
    expect(isLte(maxDate)(new Date('2020-06-02T10:00:00'))).toStrictEqual(new Date('2020-06-02T10:00:00'));
    expect(isLte(maxDate)(maxDate)).toStrictEqual(maxDate);
    expect(() => isLte(maxDate)(new Date('2020-07-01T10:00:00'))).toThrow('must be lover than or equal to');
    expect(() => isLte(maxDate)('x' as any)).toThrow('must be lover than or equal to');
  });

  it("should validate string value is lover than or equal to maxValue", function () {
    expect(isLte('B')('A')).toStrictEqual('A');
    expect(isLte('B')('B')).toStrictEqual('B');
    expect(isLte('c')('A')).toStrictEqual('A');
    expect(() => isLte('B')('a')).toThrow('must be lover than or equal to "B"');
    expect(() => isLte('B')(5 as any)).toThrow('must be lover than or equal to "B"');
  });

  it("should validate string value is lover than or equal to maxValue - caseInsensitive", function () {
    expect(isLte('b', {caseInsensitive: true})('A')).toStrictEqual('A');
  });
});
