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

  it("should apply precision", function () {
    const d: any = new Date('2020-05-10T08:30:15.123Z');
    expect(isDate({precision: 'date'})(d)).toEqual(new Date('2020-05-10T00:00:00'));
    expect(isDate({precision: 'month'})(d)).toEqual(new Date('2020-05-01T00:00:00'));
    expect(isDate({precision: 'year'})(d)).toEqual(new Date('2020-01-01T00:00:00'));
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

  it("should validate date string with time", function () {
    expect(isDateString()('2020-01-10T08:30:15Z')).toEqual('2020-01-10T08:30:15Z');
    expect(isDateString()('2020-01-10T08:30:15')).toEqual('2020-01-10T08:30:15');
    expect(isDateString()('2020-01-10T08:30')).toEqual('2020-01-10T08:30');
    expect(isDateString()('2020-01-10 08:30')).toEqual('2020-01-10 08:30');
    expect(isDateString()('2020-01-10')).toEqual('2020-01-10');
    expect(isDateString()('2020-01')).toEqual('2020-01');
    expect(isDateString()('2020')).toEqual('2020');
    expect(() => isDateString()(undefined)).toThrow('Value is not a valid date string');
    expect(() => isDateString()(null)).toThrow('Value is not a valid date string');
    expect(() => isDateString()('invalid')).toThrow('Value is not a valid date string');
  });

  it("should validate date string with time - precision = month", function () {
    expect(isDateString({precision: 'month'})('2020-01-10T08:30:15Z')).toEqual('2020-01-10T08:30:15Z');
    expect(isDateString({precision: 'month'})('2020-01-10T08:30:15')).toEqual('2020-01-10T08:30:15');
    expect(isDateString({precision: 'month'})('2020-01-10T08:30')).toEqual('2020-01-10T08:30');
    expect(isDateString({precision: 'month'})('2020-01-10 08:30')).toEqual('2020-01-10 08:30');
    expect(isDateString({precision: 'month'})('2020-01-10')).toEqual('2020-01-10');
    expect(isDateString({precision: 'month'})('2020-01')).toEqual('2020-01');
    expect(() => isDateString({precision: 'month'})('2020')).toThrow('Value is not a valid date string');
  });

  it("should validate date string with time - precision = date", function () {
    expect(isDateString({precision: 'date'})('2020-01-10T08:30:15Z')).toEqual('2020-01-10T08:30:15Z');
    expect(isDateString({precision: 'date'})('2020-01-10T08:30:15')).toEqual('2020-01-10T08:30:15');
    expect(isDateString({precision: 'date'})('2020-01-10T08:30')).toEqual('2020-01-10T08:30');
    expect(isDateString({precision: 'date'})('2020-01-10 08:30')).toEqual('2020-01-10 08:30');
    expect(isDateString({precision: 'date'})('2020-01-10')).toEqual('2020-01-10');
    expect(() => isDateString({precision: 'date'})('2020-01')).toThrow('Value is not a valid date string');
    expect(() => isDateString({precision: 'date'})('2020')).toThrow('Value is not a valid date string');
  });

  it("should validate date string with time - precision = datetime", function () {
    expect(isDateString({precision: 'time'})('2020-01-10T08:30:15Z')).toEqual('2020-01-10T08:30:15Z');
    expect(isDateString({precision: 'time'})('2020-01-10T08:30:15')).toEqual('2020-01-10T08:30:15');
    expect(isDateString({precision: 'time'})('2020-01-10T08:30')).toEqual('2020-01-10T08:30');
    expect(isDateString({precision: 'time'})('2020-01-10 08:30')).toEqual('2020-01-10 08:30');
    expect(() => isDateString({precision: 'time'})('2020-01-10')).toThrow('Value is not a valid date string');
    expect(() => isDateString({precision: 'time'})('2020-01')).toThrow('Value is not a valid date string');
    expect(() => isDateString({precision: 'time'})('2020')).toThrow('Value is not a valid date string');
  });

  it("should coerce string and trim", function () {
    let d: any = new Date('2020-01-10T08:30:15.123');
    expect(isDateString()(d, {coerce: true})).toEqual('2020-01-10T08:30:15.123');
    expect(isDateString({trim: 'time'})(d, {coerce: true})).toEqual('2020-01-10T08:30:15.123');
    expect(isDateString({trim: 'date'})(d, {coerce: true})).toEqual('2020-01-10');
    d = '2020-01-10T08:30:15.123+03:00';
    expect(isDateString({trim: 'time'})(d, {coerce: true})).toEqual('2020-01-10T08:30:15.123');
    expect(isDateString({trim: 'date'})(d, {coerce: true})).toEqual('2020-01-10');
  });

});
