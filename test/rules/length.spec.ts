import { vg } from 'valgen';

describe("rule: extractLength", function () {

  it("should return charter length of a string", function () {
    expect(vg.extractLength()('1234')).toStrictEqual(4);
    expect(vg.extractLength()('')).toStrictEqual(0);
  });

  it("should return length of an array", function () {
    expect(vg.extractLength()([1, 2, 3, 4])).toStrictEqual(4);
    expect(vg.extractLength()([])).toStrictEqual(0);
  });

  it("should return byteLength of an ArrayBuffer", function () {
    expect(vg.extractLength()(new ArrayBuffer(4))).toStrictEqual(4);
    expect(vg.extractLength()(new ArrayBuffer(0))).toStrictEqual(0);
  });

  it("should return size of a Set", function () {
    expect(vg.extractLength()(new Set([1, 2, 3, 4]))).toStrictEqual(4);
    expect(vg.extractLength()(new Set())).toStrictEqual(0);
  });

  it("should return size of a Map", function () {
    expect(vg.extractLength()(new Map([['a', 1], ['b', 2]]))).toStrictEqual(2);
    expect(vg.extractLength()(new Map())).toStrictEqual(0);
  });

  it("should return length of an object with length property", function () {
    expect(vg.extractLength()({length: 4})).toStrictEqual(4);
    expect(vg.extractLength()({length: 0})).toStrictEqual(0);
  });
})


describe("rule: lengthMin", function () {
  it("should validate the length is at least minValue", function () {
    expect(vg.lengthMin(3)('1234')).toStrictEqual('1234');
    expect(vg.lengthMin(3)('123')).toStrictEqual('123');
    expect(vg.lengthMin(3)([1, 2, 3, 4])).toStrictEqual([1, 2, 3, 4]);
    expect(() => vg.lengthMin(3)('ab')).toThrow('The length of Value must be at least 3');
    expect(() => vg.lengthMin(3)([1, 2])).toThrow('The length of Value must be at least 3');
  });
})

describe("rule: lengthMax", function () {
  it("should validate the length is at most maxValue", function () {
    expect(vg.lengthMax(3)('12')).toStrictEqual('12');
    expect(vg.lengthMax(3)('123')).toStrictEqual('123');
    expect(vg.lengthMax(3)([1, 2, 3])).toStrictEqual([1, 2, 3]);
    expect(() => vg.lengthMax(3)('1245')).toThrow('The length of Value must be at most 3');
    expect(() => vg.lengthMax(3)([1, 2, 3, 4])).toThrow('The length of Value must be at most 3');
  });

})
