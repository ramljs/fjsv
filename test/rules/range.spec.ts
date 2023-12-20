import { factories} from 'valgen';

/*
 *
 */
describe("isGt", function () {
  it("should validate number value is greater than minValue", function () {
    expect(factories.isGt(5)(6)).toStrictEqual(6);
    expect(() => factories.isGt(5)(5)).toThrow('must be greater than 5');
    expect(() => factories.isGt(5)('x' as any)).toThrow('must be greater than 5');
  });

  it("should validate bigint value is greater than minValue", function () {
    expect(factories.isGt(BigInt(5))(BigInt(6))).toStrictEqual(BigInt(6));
    expect(factories.isGt(BigInt(5))(6)).toStrictEqual(6);
    expect(() => factories.isGt(BigInt(5))(BigInt(5))).toThrow('must be greater than 5');
    expect(() => factories.isGt(BigInt(5))(5)).toThrow('must be greater than 5');
    expect(() => factories.isGt(BigInt(5))('x' as any)).toThrow('must be greater than 5');
  });

  it("should validate Date value is greater than minValue", function () {
    const minDate = new Date('2020-06-01T10:00:00');
    expect(factories.isGt(minDate)(new Date('2020-06-02T10:00:00'))).toStrictEqual(new Date('2020-06-02T10:00:00'));
    expect(() => factories.isGt(minDate)(minDate)).toThrow('must be greater than');
    expect(() => factories.isGt(minDate)(new Date('2020-05-01T10:00:00'))).toThrow('must be greater than');
    expect(() => factories.isGt(minDate)('x' as any)).toThrow('must be greater than');
  });

  it("should validate string value is greater than minValue", function () {
    expect(factories.isGt('B')('C')).toStrictEqual('C');
    expect(() => factories.isGt('B')('A')).toThrow('must be greater than "B"');
    expect(() => factories.isGt('B')('B')).toThrow('must be greater than "B"');
    expect(() => factories.isGt('b')('C')).toThrow('must be greater than "b"');
    expect(() => factories.isGt('B')(5 as any)).toThrow('must be greater than "B"');
  });

  it("should validate string value is greater than minValue - caseInsensitive", function () {
    expect(factories.isGt('b', {caseInsensitive: true})('C')).toStrictEqual('C');
  });
});

/*
 *
 */
describe("isGte", function () {
  it("should validate number value is greater or equal to than minValue", function () {
    expect(factories.isGte(5)(6)).toStrictEqual(6);
    expect(factories.isGte(5)(5)).toStrictEqual(5);
    expect(() => factories.isGte(5)(4)).toThrow('must be greater than or equal to 5');
    expect(() => factories.isGte(5)('x' as any)).toThrow('must be greater than or equal to 5');
  });

  it("should validate bigint value is greater or equal to than minValue", function () {
    expect(factories.isGte(BigInt(5))(BigInt(6))).toStrictEqual(BigInt(6));
    expect(factories.isGte(BigInt(5))(BigInt(5))).toStrictEqual(BigInt(5));
    expect(factories.isGte(BigInt(5))(6)).toStrictEqual(6);
    expect(factories.isGte(BigInt(5))(5)).toStrictEqual(5);
    expect(() => factories.isGte(BigInt(5))(BigInt(4))).toThrow('must be greater than or equal to 5');
    expect(() => factories.isGte(BigInt(5))(4)).toThrow('must be greater than or equal to 5');
    expect(() => factories.isGte(BigInt(5))('x' as any)).toThrow('must be greater than or equal to 5');
  });

  it("should validate Date value is greater than or equal to minValue", function () {
    const minDate = new Date('2020-06-01T10:00:00');
    expect(factories.isGte(minDate)(new Date('2020-06-02T10:00:00'))).toStrictEqual(new Date('2020-06-02T10:00:00'));
    expect(factories.isGte(minDate)(minDate)).toStrictEqual(minDate);
    expect(() => factories.isGte(minDate)(new Date('2020-05-01T10:00:00'))).toThrow('must be greater than');
    expect(() => factories.isGte(minDate)('x' as any)).toThrow('must be greater than');
  });

  it("should validate string value is greater than or equal to minValue", function () {
    expect(factories.isGte('B')('B')).toStrictEqual('B');
    expect(factories.isGte('B')('C')).toStrictEqual('C');
    expect(() => factories.isGte('B')('A')).toThrow('must be greater than or equal to "B"');
    expect(() => factories.isGte('b')('C')).toThrow('must be greater than or equal to "b"');
    expect(() => factories.isGte('B')(5 as any)).toThrow('must be greater than or equal to "B"');
  });

  it("should validate string value is greater than or equal to minValue - caseInsensitive", function () {
    expect(factories.isGte('abc', {caseInsensitive: true})('ABD')).toStrictEqual('ABD');
    expect(factories.isGte('abc', {caseInsensitive: true})('ABC')).toStrictEqual('ABC');
  });
});

/*
 *
 */
describe("isLt", function () {
  it("should validate number value is lover than maxValue", function () {
    expect(factories.isLt(5)(4)).toStrictEqual(4);
    expect(() => factories.isLt(5)(5)).toThrow('must be lover than 5');
    expect(() => factories.isLt(5)('x' as any)).toThrow('must be lover than 5');
  });

  it("should validate bigint value is lover than maxValue", function () {
    expect(factories.isLt(BigInt(5))(BigInt(4))).toStrictEqual(BigInt(4));
    expect(factories.isLt(BigInt(5))(4)).toStrictEqual(4);
    expect(() => factories.isLt(BigInt(5))(BigInt(5))).toThrow('must be lover than 5');
    expect(() => factories.isLt(BigInt(5))(5)).toThrow('must be lover than 5');
    expect(() => factories.isLt(BigInt(5))('x' as any)).toThrow('must be lover than 5');
  });

  it("should validate Date value is lover than maxValue", function () {
    const maxDate = new Date('2020-06-20T10:00:00');
    expect(factories.isLt(maxDate)(new Date('2020-06-02T10:00:00'))).toStrictEqual(new Date('2020-06-02T10:00:00'));
    expect(() => factories.isLt(maxDate)(maxDate)).toThrow('must be lover than');
    expect(() => factories.isLt(maxDate)(new Date('2020-07-01T10:00:00'))).toThrow('must be lover than');
    expect(() => factories.isLt(maxDate)('x' as any)).toThrow('must be lover than');
  });

  it("should validate string value is lover than maxValue", function () {
    expect(factories.isLt('B')('A')).toStrictEqual('A');
    expect(factories.isLt('c')('A')).toStrictEqual('A');
    expect(() => factories.isLt('B')('B')).toThrow('must be lover than "B"');
    expect(() => factories.isLt('B')('a')).toThrow('must be lover than "B"');
    expect(() => factories.isLt('B')(5 as any)).toThrow('must be lover than "B"');
  });

  it("should validate string value is lover than maxValue - caseInsensitive", function () {
    expect(factories.isLt('b', {caseInsensitive: true})('A')).toStrictEqual('A');
  });
});

/*
 *
 */
describe("isLte", function () {
  it("should validate number value is lover than or equal to maxValue", function () {
    expect(factories.isLte(5)(4)).toStrictEqual(4);
    expect(factories.isLte(5)(5)).toStrictEqual(5);
    expect(() => factories.isLte(5)(6)).toThrow('must be lover than or equal to 5');
    expect(() => factories.isLte(5)('x' as any)).toThrow('must be lover than or equal to 5');
  });

  it("should validate bigint value is lover than or equal to maxValue", function () {
    expect(factories.isLte(BigInt(5))(BigInt(4))).toStrictEqual(BigInt(4));
    expect(factories.isLte(BigInt(5))(4)).toStrictEqual(4);
    expect(factories.isLte(BigInt(5))(BigInt(5))).toStrictEqual(BigInt(5));
    expect(factories.isLte(BigInt(5))(5)).toStrictEqual(5);
    expect(() => factories.isLte(BigInt(5))(BigInt(6))).toThrow('must be lover than or equal to 5');
    expect(() => factories.isLte(BigInt(5))(6)).toThrow('must be lover than or equal to 5');
    expect(() => factories.isLte(BigInt(5))('x' as any)).toThrow('must be lover than or equal to 5');
  });

  it("should validate Date value is lover than or equal to maxValue", function () {
    const maxDate = new Date('2020-06-20T10:00:00');
    expect(factories.isLte(maxDate)(new Date('2020-06-02T10:00:00'))).toStrictEqual(new Date('2020-06-02T10:00:00'));
    expect(factories.isLte(maxDate)(maxDate)).toStrictEqual(maxDate);
    expect(() => factories.isLte(maxDate)(new Date('2020-07-01T10:00:00'))).toThrow('must be lover than or equal to');
    expect(() => factories.isLte(maxDate)('x' as any)).toThrow('must be lover than or equal to');
  });

  it("should validate string value is lover than or equal to maxValue", function () {
    expect(factories.isLte('B')('A')).toStrictEqual('A');
    expect(factories.isLte('B')('B')).toStrictEqual('B');
    expect(factories.isLte('c')('A')).toStrictEqual('A');
    expect(() => factories.isLte('B')('a')).toThrow('must be lover than or equal to "B"');
    expect(() => factories.isLte('B')(5 as any)).toThrow('must be lover than or equal to "B"');
  });

  it("should validate string value is lover than or equal to maxValue - caseInsensitive", function () {
    expect(factories.isLte('b', {caseInsensitive: true})('A')).toStrictEqual('A');
  });
});
