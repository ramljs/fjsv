import { isNumber, kOptions, kValidatorFn, ValidationOptions, validator } from 'valgen';

describe("validator", function () {

  it("should create new validator", function () {
    const options: ValidationOptions = {onFail: () => void 0};
    const val = validator('validator1', () => 1, options);
    expect(val).toBeInstanceOf(Function);
    expect(val[kValidatorFn]).toBeInstanceOf(Function);
    expect(val.id).toStrictEqual('validator1');
    expect(val[kOptions]).toEqual(options);
  });

  it("should extract id from function name, if id not given", function () {
    const val = validator(function validator1() {
      return;
    });
    expect(val).toBeInstanceOf(Function);
    expect(val[kValidatorFn]).toBeInstanceOf(Function);
    expect(val.id).toStrictEqual('validator1');
  });

  it("should check arguments", function () {
    expect(() => validator(0 as any)).toThrow('You must provide a rule function argument')
  });

  it("should .silent() return result object", function () {
    let r = isNumber.silent(1);
    expect(r).toStrictEqual({value: 1});
    r = isNumber.silent('x');
    expect(r).toStrictEqual({
      errors: [{
        rule: 'isNumber',
        value: 'x',
        message: 'String "x" is not a valid number value',
      }]
    });
  });

});


