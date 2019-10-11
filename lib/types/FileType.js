'use strict';
const DataType = require('../DataType');

class FileType extends DataType {

  get fileTypes() {
    return this.attributes.fileTypes;
  }

  set fileTypes(v) {
    if (v && !Array.isArray(v))
      throw new TypeError('Array type required for "fileTypes" attribute');
    this.attributes.fileTypes = v == null ? v : v.map(x => '' + x);
  }

  get minLength() {
    return this.attributes.minLength;
  }

  set minLength(v) {
    if (v == null) {
      this.attributes.minLength = v;
      return;
    }
    const x = parseInt(v, 10);
    if (isNaN(x))
      throw new TypeError(`"${v}" is not a valid number value for minLength attribute`);
    this.attributes.minLength = x;
  }

  get maxLength() {
    return this.attributes.maxLength;
  }

  set maxLength(v) {
    if (v == null) {
      this.attributes.maxLength = v;
      return;
    }
    const x = parseInt(v, 10);
    if (isNaN(x))
      throw new TypeError(`"${v}" is not a valid number value for maxLength attribute`);
    this.attributes.maxLength = x;
  }

  assign(values, overwrite) {
    super.assign(values, overwrite);
    this._assignAttributes(['fileTypes', 'minLength', 'maxLength'], values, overwrite);
  }

  _generateValidationCode(options, fnCache) {
    const data = super._generateValidationCode(options, fnCache);
    data.variables.base64Pattern =
        /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    data.code += `
        
    if (!(typeof value === 'string' && value.match(base64Pattern)))
      return unionMatch ? Failed : error({
          message: 'Value must be base64 encoded string',
          errorType: 'invalid-data-type',
          path
      });`;
    return data;
  }
}

module.exports = FileType;
