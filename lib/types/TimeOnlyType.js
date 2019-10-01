'use strict';
const DateTimeType = require('./DateTimeType');

class TimeOnlyType extends DateTimeType {

  get format() {
    return undefined;
  }

  set format(v) {
    this.attributes.format = undefined;
  }

  _getFormat() {
    return 'time-only';
  }

}

module.exports = TimeOnlyType;
