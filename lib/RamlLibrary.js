'use strict';

const TypeLibrary = require('./TypeLibrary');
const IntegerType = require('./types/IntegerType');
const Base64Type = require('./types/Base64Type');
const DateType = require('./types/DateType');
const NilType = require('./types/NilType');
const {coalesce} = require('./helpers');

class RamlLibrary extends TypeLibrary {

  constructor(options = {}) {
    super(options);
    this.addDataType('integer', new IntegerType());
    this.addDataType('file', new Base64Type());
    this.addDataType('datetime', new DateType({
      dateFormats: {datetime: 'timestamp', rfc2616: 'rfc2616'},
      format: 'datetime'
    }));
    this.addDataType('datetime-only', new DateType({
      dateFormats: {},
      format: 'datetime'
    }));
    this.addDataType('date-only', new DateType({
      dateFormats: {},
      format: 'date'
    }));
    this.addDataType('time-only', new DateType({
      dateFormats: {},
      format: 'time'
    }));
    this.addDataType('nil', new NilType());
    /* istanbul ignore next */
    this.defaults.type = coalesce(
        options.defaults && options.defaults.type, 'string');
  }

}

module.exports = RamlLibrary;
