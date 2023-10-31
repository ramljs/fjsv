import {
  forwardRef, isNumber, isObject, isString,
  ObjectSchema,
  optional, required,
} from 'valgen';

class Address {
  city?: string;
  country: string;
}

class Person {
  name: string;
  age: number;
  address?: Address
}

const addressDef: ObjectSchema = {
  city: [optional(isString()), {label: 'City'}],
  country: [required(isString()), {label: 'Country'}]
}
const personDef: ObjectSchema = {
  name: [required(isString()), {label: 'Full Name', as: 'fullName'}],
  age: [required(isNumber()), {label: 'Age'}],
  address: optional(isObject(addressDef, {ctor: Address}))
};
const personValidate = isObject(personDef, {ctor: Person});

describe("isObject", function () {

  it("should validate value is an object", function () {
    const objValidate = isObject({a: isString()});
    expect(objValidate({a: '1'})).toStrictEqual({a: '1'});
    expect(() => objValidate(null)).toThrow('Value must be an object');
    expect(() => objValidate(undefined)).toThrow('Value must be an object');
    expect(() => objValidate(NaN as any)).toThrow('Value must be an object');
  });

  it("should coerce properties", function () {
    expect(personValidate({name: 'John', age: '22'}, {coerce: true}))
        .toEqual({fullName: 'John', age: 22});
  });

  it("should set prototype", function () {
    const x = personValidate(
        {name: 'John', age: '22', address: {country: 'Italy'}},
        {coerce: true}
    );
    expect(x).toBeInstanceOf(Person);
    expect(x.address).toBeInstanceOf(Address);
  });

  it("should check required properties", function () {
    expect(() => personValidate({age: 22}))
        .toThrow('Full Name is required');
    expect(personValidate.silent({age: 22}))
        .toMatchObject({
          errors: [
            {
              context: 'Person',
              rule: 'required',
              property: 'name',
              location: 'name',
              value: undefined
            }
          ]
        });
    expect(() => personValidate({name: 'John', address: {city: 'New York'}}))
        .toThrow('Country is required');
    expect(personValidate.silent({name: 'John', address: {city: 'New York'}}))
        .toMatchObject({
          errors: [
            {
              rule: 'required',
              context: 'Address',
              label: 'Country',
              property: 'country',
              location: 'address.country',
              message: 'Country is required',
              value: undefined
            },
            {
              rule: 'required',
              context: 'Person',
              label: 'Age',
              property: 'age',
              location: 'age',
              message: 'Age is required',
              value: undefined
            }
          ]
        });
  });

  it("should detect circular dependencies", function () {
    const circularCodec = isObject({
      id: isNumber(),
      child: optional(forwardRef(() => circularCodec))
    }, {detectCircular: true});
    const child1: any = {id: 2};
    const child2: any = {id: 3};
    child2.child = child1;
    child1.child = child2;

    const obj = {
      id: 1,
      child: child1
    }
    expect(circularCodec(obj)).toEqual(obj);
  });

});
