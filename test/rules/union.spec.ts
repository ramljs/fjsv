import { isNull, isNumber, vg } from 'valgen';

describe("union", function () {

  it("should return one of valid values", function () {
    const c = vg.union([isNull, isNumber]);
    expect(c(6)).toStrictEqual(6);
    expect(c(null)).toStrictEqual(null);
    expect(() => c('x' as any)).toThrow('Value didn\'t match any on union rules');
  });

})



