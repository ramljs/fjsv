import { isDate, isDateString } from 'valgen';

describe("isDate", function () {

  it("should validate value is an instance of Date", function () {
    expect(isDate()(new Date(1))).toEqual(new Date(1));
    expect(() => isDate()(undefined)).toThrow('Value must be a Date instance');
    expect(() => isDate()(null)).toThrow('Value must be a Date instance');
    expect(() => isDate()(new Date('invalid'))).toThrow('Value must be a Date instance');
  });

  it("should coerce to Date", function () {
    expect(isDate()(1, {coerce: true})).toEqual(new Date(1));
    expect(isDate()('2020-01-10T08:30:15Z', {coerce: true})).toEqual(new Date('2020-01-10T08:30:15Z'));
    expect(isDate()('2020-01-10T08:30:15', {coerce: true})).toEqual(new Date('2020-01-10T08:30:15'));
    expect(isDate()('2020-01-10', {coerce: true})).toEqual(new Date('2020-01-10T00:00:00'));
    expect(isDate()('2020', {coerce: true})).toEqual(new Date('2020-01-01T00:00:00'));
  });

  it("should coerce to Date using custom format", function () {
    expect(isDate({format: 'DD.MM.YYYY'})('12.03.2022', {coerce: true}))
        .toEqual(new Date('2022-03-12T00:00:00'));
    expect(isDate({format: 'YYYY-MM-DD'})('2020-01-10T08:30:15', {coerce: true}))
        .toEqual(new Date('2020-01-10T00:00:00'));
  });

  it("should validate string format is valid", function () {
    expect(() => isDate()('invalid', {coerce: true}))
        .toThrow('Value must be a Date instance or a date string');
    expect(() => isDate({format: 'DD.MM.YYYY'})('invalid', {coerce: true}))
        .toThrow('Value must be a Date instance or a date string (DD.MM.YYYY)');
  });

  it("should validate string format", function () {
    expect(isDate()(1, {coerce: true})).toEqual(new Date(1));
    expect(isDate()('2020-01-10T08:30:15Z', {coerce: true})).toEqual(new Date('2020-01-10T08:30:15Z'));
    expect(isDate()('2020-01-10T08:30:15', {coerce: true})).toEqual(new Date('2020-01-10T08:30:15'));
    expect(isDate()('2020-01-10', {coerce: true})).toEqual(new Date('2020-01-10T00:00:00'));
    expect(isDate()('2020', {coerce: true})).toEqual(new Date('2020-01-01T00:00:00'));
  });

});


describe("isDateString", function () {

  it("should validate value is an DFS (Date Formatted String)", function () {
    expect(isDateString()('2020-01-10T08:30:15Z')).toEqual('2020-01-10T08:30:15Z');
    expect(isDateString()('2020-01-10T08:30:15')).toEqual('2020-01-10T08:30:15');
    expect(isDateString()('2020-01-10T08:30')).toEqual('2020-01-10T08:30');
    expect(isDateString()('2020-01-10')).toEqual('2020-01-10');
    expect(isDateString()('2020')).toEqual('2020');
    expect(() => isDateString()(undefined)).toThrow('Value is not a valid date formatted string');
    expect(() => isDateString()(null)).toThrow('Value is not a valid date formatted string');
    expect(() => isDateString()('invalid')).toThrow('Value is not a valid date formatted string');
  });

  it("should validate custom format", function () {
    expect(isDateString({format: 'DD.MM.YYYY'})('18.07.2020')).toEqual('18.07.2020');
    expect(() => isDateString({format: 'DD.MM.YYYY'})('2020-01-01'))
        .toThrow('Value is not a valid date formatted (DD.MM.YYYY) string');
  });

  it("should coerce to string", function () {
    expect(isDateString()(new Date(1), {coerce: true})).toEqual(new Date(1).toISOString());
    expect(isDateString({format: 'YYYY-MM-DD'})('2020-01-10T08:30:15', {coerce: true}))
        .toEqual('2020-01-10');
    expect(isDateString({format: 'HH:mm:ss'})('08:30:15', {coerce: true}))
        .toEqual('08:30:15');
    expect(isDateString({format: ['HH:mm:ss', 'HH:mm']})('08:30', {coerce: true}))
        .toEqual('08:30:00');
  });

});
