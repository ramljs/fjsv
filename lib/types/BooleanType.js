'use strict';
const DataType = require('../DataType');

class BooleanType extends DataType {

  get default() {
    return this.attributes.default;
  }

  set default(v) {
    this.attributes.default = v == null ? v : !!v;
  }

  _generateValidationCode(options) {
    const data = super._generateValidationCode(options);
    const {strictTypes} = options;
    data.code += `
            if (!(typeof value === 'boolean'`;
    if (!strictTypes)
      data.code +=
          ` || (value === 0 || value === 1 || value === 'false' || value === 'true')`;
    data.code += `)
            ) {
                error({
                    message: 'Value must be a boolean',
                    errorType: 'invalid-data-type',
                    path
                });
                return;
            }            
`;
    if (options.coerceTypes && !strictTypes)
      data.code += '\n    value = value === \'false\' ? false : !!value';
    return data;
  }
}

module.exports = BooleanType;
