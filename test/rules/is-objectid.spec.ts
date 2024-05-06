import { isObjectId } from 'valgen';

describe("isObjectId", function () {

  const idString: string = '64897efbdf01a60ac1b678ea';
  const idArray: Uint8Array = Uint8Array.from(idString.match(/.{1,2}/g)
      .map((byte) => parseInt(byte, 16)));
  const idObject: any = {
    id: idString,
    toHexString: () => idString
  }

  it("should validate value is an ObjectId", function () {
    expect(isObjectId(idString)).toStrictEqual(idString);
    expect(isObjectId(idArray)).toStrictEqual(idArray);
    expect(isObjectId(idObject)).toStrictEqual(idObject);
    expect(() => isObjectId(undefined)).toThrow('"undefined" is not a valid ObjectId');
    expect(() => isObjectId(null)).toThrow('"null" is not a valid ObjectId');
    expect(() => isObjectId(NaN as any)).toThrow('"NaN" is not a valid ObjectId');
  });

});
