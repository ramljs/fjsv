'use strict';

const DataType = require('./DataType');
const AnyType = require('./types/AnyType');
const ArrayType = require('./types/ArrayType');
const BooleanType = require('./types/BooleanType');
const NumberType = require('./types/NumberType');
const ObjectType = require('./types/ObjectType');
const StringType = require('./types/StringType');
const DateTimeType = require('./types/DateTimeType');
const DateOnlyType = require('./types/DateOnlyType');
const TimeOnlyType = require('./types/TimeOnlyType');
const DateTimeOnlyType = require('./types/DateTimeOnlyType');
const IntegerType = require('./types/IntegerType');
const NilType = require('./types/NilType');
const UnionType = require('./types/UnionType');
const {normalizeTypeDef} = require('./helpers');

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
    for (const [name, Clazz] of Object.entries({
      'boolean': BooleanType,
      'number': NumberType,
      'string': StringType,
      'array': ArrayType,
      'object': ObjectType
    })) {
      this.register(name, Clazz);
    }
    if (options.typeSet === TYPESET.RAML_1_0) {
      for (const [name, Clazz] of Object.entries({
        'any': AnyType,
        'integer': IntegerType,
        'nil': NilType,
        'datetime': DateTimeType,
        'datetime-only': DateTimeOnlyType,
        'date-only': DateOnlyType,
        'time-only': TimeOnlyType,
        'union': UnionType
      })) {
        this.register(name, Clazz);
      }
    }
  }

  register(name, Clazz) {
    if (!(Clazz.prototype instanceof DataType))
      throw new TypeError('Class must be extended from DataType');
    const t = this.types[name] = new Clazz();
    t.name = name;
  }

  get(def) {
    if (!def)
      throw new TypeError('Invalid argument');
    if (typeof def === 'string' && this.types[def])
      return this.types[def];

    def = normalizeTypeDef(def, this.defaults.type);

    if (typeof def.type === 'string') {
      const derivedName = def.type;
      let derivedType = this.types[derivedName];
      if (!derivedType) {
        let v = this.onTypeLookup && this.onTypeLookup(def.type);
        if (!v || v === def.type)
          throw new Error(`Unknown type "${def.type}"`);
        if (typeof v === 'string')
          v = normalizeTypeDef(v, this.defaults.type);
        derivedType = this.get(v);
        derivedType.name = derivedName;
        this.types[derivedName] = derivedType;
      }
      const t = derivedType.createNew(this);
      t.assign(def);
      t.type.push(derivedType);
      return t;
    }

    if (Array.isArray(def.type)) {
      const types = def.type.map(t => this.get(t));
      const t = types[0].createNew(this);
      t.assign(def);
      t.type.push(...types);
      return t;
    }

    const derivedType = def.type instanceof DataType ?
        def.type : this.get(def.type);
    return derivedType.extend(this, def);
  }

}

TypeLibrary.TYPESET = TYPESET;

module.exports = TypeLibrary;
