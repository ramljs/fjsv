'use strict';

const DataType = require('./DataType');
const AnyType = require('./types/AnyType');
const ArrayType = require('./types/ArrayType');
const BooleanType = require('./types/BooleanType');
const NumberType = require('./types/NumberType');
const ObjectType = require('./types/ObjectType');
const StringType = require('./types/StringType');
const UnionType = require('./types/UnionType');
const FunctionType = require('./types/FunctionType');
const {normalizeTypeSchema, parseTypeName} = require('./helpers');

const TYPESET = {
  RAML_1_0: 'RAML_1_0'
};

class TypeLibrary {

  constructor(options = {}) {
    this.onTypeLookup = options.onTypeLookup;
    this.defaults = {
      type: options.defaults && options.defaults.type,
      required: options.defaults && options.defaults.required,
      additionalProperties: options.defaults &&
          options.defaults.additionalProperties
    };
    this.types = {};
    this.schema = {};
    for (const [name, Clazz] of Object.entries({
      'any': AnyType,
      'boolean': BooleanType,
      'number': NumberType,
      'string': StringType,
      'array': ArrayType,
      'object': ObjectType,
      'union': UnionType,
      'function': FunctionType
    })) {
      this.register(name, Clazz);
    }
    if (options.typeSet === TYPESET.RAML_1_0) {
      for (const [name, Clazz] of Object.entries({
        'integer': require('./types/IntegerType'),
        'nil': require('./types/NilType'),
        'datetime': require('./types/DateTimeType'),
        'datetime-only': require('./types/DateTimeOnlyType'),
        'date-only': require('./types/DateOnlyType'),
        'time-only': require('./types/TimeOnlyType'),
        'file': require('./types/FileType')
      })) {
        this.register(name, Clazz);
      }
    }
  }

  register(name, Clazz) {
    if (!(Clazz.prototype instanceof DataType))
      throw new TypeError('Class must be extended from DataType');
    const t = this.types[name] = new Clazz(this);
    t.name = name;
  }

  add(def) {
    if (typeof def !== 'object')
      throw new TypeError(`You must provide object instance as first argument`);

    if (!(def.name && typeof def.name === 'string'))
      throw new Error('You must provide type name');

    if (this.types[def.name])
      throw new Error(`Type "${def.name}"`);

    this.schema[def.name] = {...def};
  }

  get(def) {
    if (!def)
      throw new TypeError('Invalid argument');

    // If requesting for a type by its name
    if (typeof def === 'string' &&
        typeof (def = parseTypeName(def)) === 'string') {
      // Return pre-created type instance
      if (this.types[def])
        return this.types[def];
      // Get type schema
      let v = this.schema[def] ||
          (this.onTypeLookup && this.onTypeLookup(def));
      if (!v || v === def)
        throw new Error(`Unknown type "${def}"`);
      if (typeof v === 'string')
        v = normalizeTypeSchema(v, this.defaults.type);
      v = {...v, name: def};
      const t = this.get({...v, name: def});
      return this.types[t.name] = t;
    }

    // If requesting for a type by schema
    def = normalizeTypeSchema(def, this.defaults.type);

    const derivedType = def.type instanceof DataType ? def.type :
        Array.isArray(def.type) ? this.get(def.type[0]) :
            this.get(def.type);
    const t = derivedType.createNew(this, def);
    t._baseName = derivedType.baseName;
    return t;
  }

}

TypeLibrary.TYPESET = TYPESET;

module.exports = TypeLibrary;
