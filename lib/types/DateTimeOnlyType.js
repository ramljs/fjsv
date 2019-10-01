'use strict';
const DateTimeType = require('./DateTimeType');

class DateTimeOnlyType extends DateTimeType {

  get format() {
    return undefined;
  }

  set format(v) {
    this.attributes.format = undefined;
  }

  _getFormat() {
    return 'datetime-only';
  }

}

module.exports = DateTimeOnlyType;
