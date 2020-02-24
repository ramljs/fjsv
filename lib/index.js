const {Valgen} = require('./Valgen');
const {AnyFactory} = require('./factories/AnyFactory');
const {ArrayFactory} = require('./factories/ArrayFactory');
const {BooleanFactory} = require('./factories/BooleanFactory');
const {DateFactory} = require('./factories/DateFactory');
const {IntegerFactory} = require('./factories/IntegerFactory');
const {NilFactory} = require('./factories/NilFactory');
const {NumberFactory} = require('./factories/NumberFactory');
const {ObjectFactory} = require('./factories/ObjectFactory');
const {StringFactory} = require('./factories/StringFactory');
const {UnionFactory} = require('./factories/UnionFactory');
const {Base64Factory} = require('./factories/Base64Factory');
const {FunctionFactory} = require('./factories/FunctionFactory');

function vg(options) {
  return new Valgen(options);
}

module.exports = vg;

Object.assign(vg, {
  Valgen,
  AnyFactory,
  ArrayFactory,
  BooleanFactory,
  DateFactory,
  IntegerFactory,
  NilFactory,
  NumberFactory,
  ObjectFactory,
  StringFactory,
  UnionFactory,
  Base64Factory,
  FunctionFactory
});
