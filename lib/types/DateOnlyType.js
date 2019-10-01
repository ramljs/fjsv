'use strict';
const DateTimeType = require('./DateTimeType');

class DateOnlyType extends DateTimeType {

  get format() {
    return undefined;
  }

  set format(v) {
    this.attributes.format = undefined;
  }

  _getFormat() {
    return 'date-only';
  }

}

module.exports = DateOnlyType;
