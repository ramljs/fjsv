'use strict';
const merge = require('putil-merge');
const AnyType = require('./AnyType');

class UnionType extends AnyType {

  set(dataType, attr, v) {
    switch (attr) {
      case 'anyOf': {
        if (v && !Array.isArray(v))
          throw new TypeError('Value must be an array');
        if (v && v.length < 2)
          throw new TypeError('Value must contain at least 2 items');

        const additionalAttributes = merge({}, dataType.schema, {
          filter: (o, n, v) => !['name', 'type', 'anyOf'].includes(n)
        });
        const hasAdditionalAttributes = Object.keys(additionalAttributes).length;

        dataType.anyOf = v.map(x => {
              let t = x instanceof AnyType ? x : dataType.library.get(x);
              if (hasAdditionalAttributes) {
                t = t.clone();
                Object.assign(t.schema, additionalAttributes);
                t.merge(dataType.schema);
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
    data.variables.subValidators = anyOf.map(t => t.factory._generateFunction(t, options));

    data.code += `    
    const len = subValidators.length;
    let bestFn;
    let bestRank = 0;   
    for (let i = 0; i < len; i++) {
      const fn = subValidators[i];
      const rank = fn(value, path, (e) => null, {...ctx, unionMatch: true});
      if (rank !== Failed && (rank === undefined || rank>bestRank)) {
        bestFn = fn;
        if (rank === 1 || rank === undefined)        
          break;
        bestRank = rank;  
      }        
    }

    if (!bestFn)
      return error({
        message: path +' does not match any of expected types',
        errorType: 'no-type-matched',
        path
      });
    return bestFn(value, path, error, ctx);        
    `;
    return data;
  }

}

module.exports = UnionType;
