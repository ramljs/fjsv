'use strict';

const TypeLibrary = require('./TypeLibrary');

class RamlLibrary extends TypeLibrary {

  constructor(options = {}) {
    super(options);
    /*
    Object.assign(this.classes, {
      'integer': require('./types/IntegerType'),
      'nil': require('./types/NilType'),
      'datetime': require('./types/DateType'),
      'datetime-only': require('./types/DateTimeOnlyType'),
      'date-only': require('./types/DateOnlyType'),
      'time-only': require('./types/TimeOnlyType'),
      'file': require('./types/Base64Type')
    });*/
    this.defaultType = options.defaultType || 'string';
  }

}

module.exports = RamlLibrary;
