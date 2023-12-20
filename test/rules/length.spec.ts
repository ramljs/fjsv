import { factories } from 'valgen';

describe("rule: extractLength", function () {

  it("should return charter length of a string", function () {
    expect(factories.extractLength()('1234')).toStrictEqual(4);
    expect(factories.extractLength()('')).toStrictEqual(0);
  });

  it("should return length of an array", function () {
    expect(factories.extractLength()([1, 2, 3, 4])).toStrictEqual(4);
    expect(factories.extractLength()([])).toStrictEqual(0);
  });

  it("should return byteLength of an ArrayBuffer", function () {
    expect(factories.extractLength()(new ArrayBuffer(4))).toStrictEqual(4);
    expect(factories.extractLength()(new ArrayBuffer(0))).toStrictEqual(0);
  });

  it("should return size of a Set", function () {
    expect(factories.extractLength()(new Set([1, 2, 3, 4]))).toStrictEqual(4);
    expect(factories.extractLength()(new Set())).toStrictEqual(0);
  });

  it("should return size of a Map", function () {
    expect(factories.extractLength()(new Map([['a', 1], ['b', 2]]))).toStrictEqual(2);
    expect(factories.extractLength()(new Map())).toStrictEqual(0);
  });

  it("should return length of an object with length property", function () {
    expect(factories.extractLength()({length: 4})).toStrictEqual(4);
    expect(factories.extractLength()({length: 0})).toStrictEqual(0);
  });
})


describe("rule: lengthMin", function () {
  it("should validate the length is at least minValue", function () {
    expect(factories.lengthMin(3)('1234')).toStrictEqual('1234');
    expect(factories.lengthMin(3)('123')).toStrictEqual('123');
    expect(factories.lengthMin(3)([1, 2, 3, 4])).toStrictEqual([1, 2, 3, 4]);
    expect(() => factories.lengthMin(3)('ab')).toThrow('The length of Value must be at least 3');
    expect(() => factories.lengthMin(3)([1, 2])).toThrow('The length of Value must be at least 3');
  });
})

describe("rule: lengthMax", function () {
  it("should validate the length is at most maxValue", function () {
    expect(factories.lengthMax(3)('12')).toStrictEqual('12');
    expect(factories.lengthMax(3)('123')).toStrictEqual('123');
    expect(factories.lengthMax(3)([1, 2, 3])).toStrictEqual([1, 2, 3]);
    expect(() => factories.lengthMax(3)('1245')).toThrow('The length of Value must be at most 3');
    expect(() => factories.lengthMax(3)([1, 2, 3, 4])).toThrow('The length of Value must be at most 3');
  });

})
