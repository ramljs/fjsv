import { $any, $number, $record, $string } from 'valgen';

describe("record", function () {

  it("should return undefined if nullish", function () {
    expect($record($string, $any)(null)).toStrictEqual(undefined);
    expect($record($string, $any)(undefined)).toStrictEqual(undefined);
  });

  it("should transform keys according to given codec", function () {
    expect($record($string, $any)({0: 'a', 1: 'b'}))
        .toEqual({'0': 'a', '1': 'b'});
  });

  it("should transform values according to given codec", function () {
    expect($record($string, $number)({a: '0', b: '1'} as any))
        .toEqual({a: 0, b: 1});
  });

});
