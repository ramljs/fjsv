import { $number } from 'valgen';

describe("codec", function () {

  it("should customize error message", function () {
    expect(() => $number('a1', {onFail: (v) => `invalid:${v.input}`}))
        .toThrow('invalid:a1');
    expect(() => $number('a1', {onFail: () => ({message: 'invalid:{{input}}'})}))
        .toThrow('invalid:"a1"');
  });

});


