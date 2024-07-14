import { vg } from 'valgen';

describe('getLength', () => {
  it('should return charter length of a string', () => {
    expect(vg.getLength()('1234')).toStrictEqual(4);
    expect(vg.getLength()('')).toStrictEqual(0);
  });

  it('should return length of an array', () => {
    expect(vg.getLength()([1, 2, 3, 4])).toStrictEqual(4);
    expect(vg.getLength()([])).toStrictEqual(0);
  });

  it('should return byteLength of an ArrayBuffer', () => {
    expect(vg.getLength()(new ArrayBuffer(4))).toStrictEqual(4);
    expect(vg.getLength()(new ArrayBuffer(0))).toStrictEqual(0);
  });

  it('should return size of a Set', () => {
    expect(vg.getLength()(new Set([1, 2, 3, 4]))).toStrictEqual(4);
    expect(vg.getLength()(new Set())).toStrictEqual(0);
  });

  it('should return size of a Map', () => {
    expect(
      vg.getLength()(
        new Map([
          ['a', 1],
          ['b', 2],
        ]),
      ),
    ).toStrictEqual(2);
    expect(vg.getLength()(new Map())).toStrictEqual(0);
  });

  it('should return length of an object with length property', () => {
    expect(vg.getLength()({ length: 4 })).toStrictEqual(4);
    expect(vg.getLength()({ length: 0 })).toStrictEqual(0);
  });
});
