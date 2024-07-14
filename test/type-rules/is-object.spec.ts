import {
  forwardRef,
  isNumber,
  IsObject,
  isString,
  postValidation,
  preValidation,
  vg,
} from 'valgen';

class Address {
  city?: string;
  country: string;
}

class Person {
  name: string;
  age: number;
  address?: Address;
}

const addressDef: IsObject.Schema = {
  city: [vg.optional(isString), { label: 'City' }],
  country: [vg.required(isString), { label: 'Country' }],
};
const personDef: IsObject.Schema = {
  name: [vg.required(isString), { label: 'Full Name', as: 'fullName' }],
  age: [vg.required(isNumber), { label: 'Age' }],
  address: vg.optional(vg.isObject(addressDef, { ctor: Address })),
};
const personValidate = vg.isObject(personDef, { ctor: Person });

describe('isObject', () => {
  it('should validate value is an object', () => {
    const objValidate = vg.isObject({ a: isString });
    expect(objValidate({ a: '1' })).toStrictEqual({ a: '1' });
    expect(() => objValidate(null)).toThrow('"null" is not an object');
    expect(() => objValidate(undefined)).toThrow(
      '"undefined" is not an object',
    );
    expect(() => objValidate(NaN as any)).toThrow('"NaN" is not an object');
  });

  it('should parse json if coerce=true', () => {
    expect(
      personValidate('{"name": "John", "age": "22"}', { coerce: true }),
    ).toEqual({ fullName: 'John', age: 22 });
  });

  it('should coerce properties', () => {
    expect(
      personValidate({ name: 'John', age: '22' }, { coerce: true }),
    ).toEqual({ fullName: 'John', age: 22 });
  });

  it('should set prototype', () => {
    const x = personValidate(
      { name: 'John', age: '22', address: { country: 'Italy' } },
      { coerce: true },
    );
    expect(x).toBeInstanceOf(Person);
    expect(x.address).toBeInstanceOf(Address);
  });

  it('should check required properties', () => {
    expect(() => personValidate({ age: 22 })).toThrow('Full Name is required');
    expect(personValidate.silent({ age: 22 })).toMatchObject({
      errors: [
        {
          context: 'Person',
          rule: 'required',
          property: 'name',
          location: 'name',
          value: undefined,
        },
      ],
    });
    expect(() =>
      personValidate({ name: 'John', address: { city: 'New York' } }),
    ).toThrow('Country is required');
    expect(
      personValidate.silent({ name: 'John', address: { city: 'New York' } }),
    ).toMatchObject({
      errors: [
        {
          rule: 'required',
          context: 'Address',
          label: 'Country',
          property: 'country',
          location: 'address.country',
          message: 'Country is required',
          value: undefined,
        },
        {
          rule: 'required',
          context: 'Person',
          label: 'Age',
          property: 'age',
          location: 'age',
          message: 'Age is required',
          value: undefined,
        },
      ],
    });
  });

  it('should detect circular dependencies', () => {
    const circularCodec = vg.isObject(
      {
        id: isNumber,
        child: vg.optional(forwardRef(() => circularCodec)),
      },
      { detectCircular: true },
    );
    const child1: any = { id: 2 };
    const child2: any = { id: 3 };
    child2.child = child1;
    child1.child = child2;

    const obj = {
      id: 1,
      child: child1,
    };
    expect(circularCodec(obj)).toEqual(obj);
  });

  it('should call [preValidation] function', () => {
    Person[preValidation] = function (input) {
      return { ...input, age: input.age + 1 };
    };
    expect(personValidate({ name: 'julia', age: 18 })).toEqual({
      fullName: 'julia',
      age: 19,
    });
    Person[preValidation] = undefined;
  });

  it('should call [postValidation] function', () => {
    Person[postValidation] = function (input: Person) {
      input.age = input.age + 2;
    };
    expect(personValidate({ name: 'julia', age: 18 })).toEqual({
      fullName: 'julia',
      age: 20,
    });
    Person[postValidation] = undefined;
  });
});
