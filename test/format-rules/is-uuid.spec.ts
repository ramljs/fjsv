import { isUUID, isUUID1, isUUID2, isUUID3, isUUID4, isUUID5 } from 'valgen';

describe('isUUID', function () {
  const uuidV1: string = '3c6aed92-0a89-11ee-be56-0242ac120002';
  const uuidV2: string = '000003e8-0a8a-21ee-9e00-2eb5a363657c';
  const uuidV3: string = 'b2c449de-aa9b-36d4-b548-2642ba1e161a';
  const uuidV4: string = '01e0fee8-60d5-42a5-997c-b55a4f3e973f';
  const uuidV5: string = 'a0657685-23c5-5cbc-81a4-dd72b3743c21';

  it('should validate value is a uuid', function () {
    expect(isUUID(uuidV1)).toStrictEqual(uuidV1);
    expect(isUUID(uuidV2)).toStrictEqual(uuidV2);
    expect(isUUID(uuidV3)).toStrictEqual(uuidV3);
    expect(isUUID(uuidV4)).toStrictEqual(uuidV4);
    expect(isUUID(uuidV5)).toStrictEqual(uuidV5);
    expect(() => isUUID(undefined)).toThrow('is not a valid UUID');
    expect(() => isUUID(null)).toThrow('is not a valid UUID');
    expect(() => isUUID(NaN as any)).toThrow('is not a valid UUID');
  });

  it('should validate value is a uuid v1', function () {
    expect(isUUID1(uuidV1)).toStrictEqual(uuidV1);
    expect(() => isUUID1(uuidV2)).toThrow('Value is not a valid UUID v1');
    expect(() => isUUID1(uuidV3)).toThrow('Value is not a valid UUID v1');
    expect(() => isUUID1(uuidV4)).toThrow('Value is not a valid UUID v1');
    expect(() => isUUID1(uuidV5)).toThrow('Value is not a valid UUID v1');
  });

  it('should validate value is a uuid v2', function () {
    expect(() => isUUID2(uuidV1)).toThrow('Value is not a valid UUID v2');
    expect(isUUID2(uuidV2)).toStrictEqual(uuidV2);
    expect(() => isUUID2(uuidV3)).toThrow('Value is not a valid UUID v2');
    expect(() => isUUID2(uuidV4)).toThrow('Value is not a valid UUID v2');
    expect(() => isUUID2(uuidV5)).toThrow('Value is not a valid UUID v2');
  });

  it('should validate value is a uuid v3', function () {
    expect(() => isUUID3(uuidV1)).toThrow('Value is not a valid UUID v3');
    expect(() => isUUID3(uuidV2)).toThrow('Value is not a valid UUID v3');
    expect(isUUID3(uuidV3)).toStrictEqual(uuidV3);
    expect(() => isUUID3(uuidV4)).toThrow('Value is not a valid UUID v3');
    expect(() => isUUID3(uuidV5)).toThrow('Value is not a valid UUID v3');
  });

  it('should validate value is a uuid v4', function () {
    expect(() => isUUID4(uuidV1)).toThrow('Value is not a valid UUID v4');
    expect(() => isUUID4(uuidV2)).toThrow('Value is not a valid UUID v4');
    expect(() => isUUID4(uuidV3)).toThrow('Value is not a valid UUID v4');
    expect(isUUID4(uuidV4)).toStrictEqual(uuidV4);
    expect(() => isUUID4(uuidV5)).toThrow('Value is not a valid UUID v4');
  });

  it('should validate value is a uuid v5', function () {
    expect(() => isUUID5(uuidV1)).toThrow('Value is not a valid UUID v5');
    expect(() => isUUID5(uuidV2)).toThrow('Value is not a valid UUID v5');
    expect(() => isUUID5(uuidV3)).toThrow('Value is not a valid UUID v5');
    expect(() => isUUID5(uuidV4)).toThrow('Value is not a valid UUID v5');
    expect(isUUID5(uuidV5)).toStrictEqual(uuidV5);
  });
});
