const TypeLibrary = require('./TypeLibrary');
const RamlLibrary = require('./RamlLibrary');

function valgen(options) {
  return new TypeLibrary(options);
}

valgen.raml = function(options) {
  return new RamlLibrary(options);
};

valgen.TypeLibrary = TypeLibrary;
valgen.RamlLibrary = RamlLibrary;

valgen.types = {
  AnyType: require('./types/AnyType'),
  ArrayType: require('./types/ArrayType'),
  BooleanType: require('./types/BooleanType'),
  DateType: require('./types/DateType'),
  IntegerType: require('./types/IntegerType'),
  NilType: require('./types/NilType'),
  NumberType: require('./types/NumberType'),
  ObjectType: require('./types/ObjectType'),
  StringType: require('./types/StringType'),
  UnionType: require('./types/UnionType'),
  Base64Type: require('./types/Base64Type'),
  FunctionType: require('./types/FunctionType')
};

module.exports = valgen;
