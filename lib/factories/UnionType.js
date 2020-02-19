'use strict';
const merge = require('putil-merge');
const {AnyType} = require('./AnyType');
const {DataType} = require('../DataType');

class UnionType extends AnyType {

  prepareCompileOptions(options) {
    return options;
  }

  set(dataType, attr, v, schema) {
    switch (attr) {
      case 'anyOf': {
        if (v && !Array.isArray(v))
          throw new TypeError('Value must be an array');
        if (v && v.length < 2)
          throw new TypeError('Value must contain at least 2 items');

        const additionalAttributes = merge({}, schema, {
          filter: (o, n) => !['name', 'type', 'anyOf', 'library',
            'factory'].includes(n)
        });
        const hasAdditionalAttributes = Object.keys(additionalAttributes).length;

        dataType.anyOf = v.map(x => {
              let t = x instanceof DataType ? x : dataType.library._create(x);
              if (hasAdditionalAttributes) {
                t = t.clone();
                t.assign(additionalAttributes);
              }
              return t;
            }
        );
        return;
      }
    }
    super.set(attr, v);
  }

  _generateValidationCode(dataType, options) {
    const data = super._generateValidationCode(dataType, options);
    const anyOf = dataType.anyOf;
    data.variables.subValidators =
        anyOf.map(t => t.generate(options));

    data.code += `    
    const len = subValidators.length;
    let bestFn;
    let bestRank = 0;   
    for (let i = 0; i < len; i++) {
      const fn = subValidators[i];
      let rank = fn(value, {...ctx, typeCheck: true});
      if (!rank.valid)
        continue;
      rank = rank.value;  
      if (rank === undefined || rank > bestRank) {
        bestFn = fn;
        if (rank === 1 || rank === undefined)        
          break;
        bestRank = rank;  
      }        
    }

    if (!bestFn) {      
      return ctx.logError({
        message: 'Value does not match any of expected types.',
        errorType: 'no-type-matched'
      });
    }  
    const vv = bestFn(value, ctx);
    if (vv.valid)
      return vv.value;        
    `;
    return data;
  }

}

module.exports = {UnionType};
