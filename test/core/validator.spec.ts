import {
  isNumber,
  kOptions,
  kValidatorFn,
  ValidationOptions,
  validator,
} from 'valgen';

describe('validator', () => {
  it('should create new validator', () => {
    const options: ValidationOptions = { onFail: () => undefined };
    const val = validator('validator1', () => 1, options);
    expect(val).toBeInstanceOf(Function);
    expect(val[kValidatorFn]).toBeInstanceOf(Function);
    expect(val.id).toStrictEqual('validator1');
    expect(val[kOptions]).toEqual(options);
  });

  it('should extract id from function name, if id not given', () => {
    const val = validator(() => {});
    expect(val).toBeInstanceOf(Function);
    expect(val[kValidatorFn]).toBeInstanceOf(Function);
    expect(val.id).toMatch(/^validator\d/);
  });

  it('should check arguments', () => {
    expect(() => validator(0 as any)).toThrow(
      'You must provide a rule function argument',
    );
  });

  it('should .silent() return result object', () => {
    let r = isNumber.silent(1);
    expect(r).toStrictEqual({ value: 1 });
    r = isNumber.silent('x');
    expect(r).toStrictEqual({
      errors: [
        {
          rule: 'isNumber',
          value: 'x',
          message: 'String "x" is not a valid number value',
        },
      ],
    });
  });
});
