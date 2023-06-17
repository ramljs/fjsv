import { extractLength, lengthMax, lengthMin } from 'valgen';

describe("rule: extractLength", function () {

  it("should return charter length of a string", function () {
    expect(extractLength()('1234')).toStrictEqual(4);
    expect(extractLength()('')).toStrictEqual(0);
  });

  it("should return length of an array", function () {
    expect(extractLength()([1, 2, 3, 4])).toStrictEqual(4);
    expect(extractLength()([])).toStrictEqual(0);
  });

  it("should return byteLength of an ArrayBuffer", function () {
    expect(extractLength()(new ArrayBuffer(4))).toStrictEqual(4);
    expect(extractLength()(new ArrayBuffer(0))).toStrictEqual(0);
  });

  it("should return size of a Set", function () {
    expect(extractLength()(new Set([1, 2, 3, 4]))).toStrictEqual(4);
    expect(extractLength()(new Set())).toStrictEqual(0);
  });

  it("should return size of a Map", function () {
    expect(extractLength()(new Map([['a', 1], ['b', 2]]))).toStrictEqual(2);
    expect(extractLength()(new Map())).toStrictEqual(0);
  });

  it("should return length of an object with length property", function () {
    expect(extractLength()({length: 4})).toStrictEqual(4);
    expect(extractLength()({length: 0})).toStrictEqual(0);
  });
})


describe("rule: lengthMin", function () {
  it("should validate the length is at least minValue", function () {
    expect(lengthMin(3)('1234')).toStrictEqual('1234');
    expect(lengthMin(3)('123')).toStrictEqual('123');
    expect(lengthMin(3)([1, 2, 3, 4])).toStrictEqual([1, 2, 3, 4]);
    expect(() => lengthMin(3)('ab')).toThrow('The length of Value must be at least 3');
    expect(() => lengthMin(3)([1, 2])).toThrow('The length of Value must be at least 3');
  });
})

describe("rule: lengthMax", function () {
  it("should validate the length is at most maxValue", function () {
    expect(lengthMax(3)('12')).toStrictEqual('12');
    expect(lengthMax(3)('123')).toStrictEqual('123');
    expect(lengthMax(3)([1, 2, 3])).toStrictEqual([1, 2, 3]);
    expect(() => lengthMax(3)('1245')).toThrow('The length of Value must be at most 3');
    expect(() => lengthMax(3)([1, 2, 3, 4])).toThrow('The length of Value must be at most 3');
  });

})
