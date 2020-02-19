'use strict';

const {TypeLibrary} = require('./TypeLibrary');
const {IntegerType} = require('./factories/IntegerType');
const {Base64Type} = require('./factories/Base64Type');
const {DateType} = require('./factories/DateType');
const {NilType} = require('./factories/NilType');
const {coalesce} = require('./helpers');

class RamlLibrary extends TypeLibrary {

  constructor(options = {}) {
    super(options);
    this.define('integer', new IntegerType());
    this.define('file', new Base64Type());
    this.define('datetime', new DateType({
      dateFormats: {datetime: 'timestamp', rfc2616: 'rfc2616'},
      format: 'datetime'
    }));
    this.define('datetime-only', new DateType({
      dateFormats: {},
      format: 'datetime'
    }));
    this.define('date-only', new DateType({
      dateFormats: {},
      format: 'date'
    }));
    this.define('time-only', new DateType({
      dateFormats: {},
      format: 'time'
    }));
    this.define('nil', new NilType());
    /* istanbul ignore next */
    this.defaults.type = coalesce(
        options.defaults && options.defaults.type, 'string');
  }

}

module.exports = {RamlLibrary};
