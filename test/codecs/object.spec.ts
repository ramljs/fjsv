import {
  $forwardRef, $number, $object,
  $optional, $required, $string
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

describe("object", function () {
  const addressDef = {
    city: $string,
    country: $required($string)
  }
  const addressCodec = $object(addressDef, {ctor: Address});
  const personDef = {
    name: $required($string),
    age: $number,
    address: addressCodec
  };
  const personCodec = $object(personDef, {ctor: Person});

  it("should return undefined if nullish", function () {
    expect(personCodec(null)).toStrictEqual(undefined);
    expect(personCodec(undefined)).toStrictEqual(undefined);
  });

  it("should transform properties", function () {
    expect(personCodec({name: 'John', age: '22'}))
        .toEqual({name: 'John', age: 22});
  });

  it("should set prototype", function () {
    const x = personCodec({name: 'John', age: '22', address: {country: 'Italy'}});
    expect(x).toBeInstanceOf(Person);
    expect(x.address).toBeInstanceOf(Address);
  });

  it("should check required properties", function () {
    expect(() => personCodec({age: 22}))
        .toThrow('"name" is required')
    expect(() => personCodec({name: 'John', address: {city: 'New York'}}))
        .toThrow('"address.country" is required')
  });

  it("should detect circular dependencies", function () {
    const circularCodec = $object({
      id: $number,
      child: $optional($forwardRef(() => circularCodec))
    })
    const child1: any = {id: 2};
    const child2: any = {id: 3};
    child2.child = child1;
    child1.child = child2;

    const obj = {
      id: 1,
      child: child1
    }
    expect(circularCodec(obj, {detectCircular: true})).toEqual(obj);
  });

});
