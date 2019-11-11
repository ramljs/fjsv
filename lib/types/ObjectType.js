'use strict';

const AnyType = require('./AnyType');
const {coerceToString, coerceToInt, coerceToBool} = require('../helpers');

class ObjectType extends AnyType {

  set(dataType, attr, v) {
    switch (attr) {
      case 'discriminator': {
        dataType.discriminator = coerceToString(v);
        return;
      }
      case 'discriminatorValue': {
        dataType.discriminatorValue = v;
        return;
      }
      case 'additionalProperties': {
        dataType.additionalProperties = v;
        return;
      }
      case 'minProperties':
      case 'maxProperties': {
        dataType[attr] = coerceToInt(v);
        return;
      }
      case 'isTypeOf': {
        if (v && typeof v !== 'function')
          throw new TypeError('Value must be a Function.');
        dataType.isTypeOf = v;
        return;
      }
      case 'properties': {
        const addProperty = (name, schema) => {
          const m = name.match(/^([^?!]+)([?|!])?$/);
          if (!m)
            throw new Error(`${name} is not a valid property name`);
          const prop = schema instanceof Property ?
              new Property(m[1], schema.dataType,
                  (m[2] ? (m[2] === '!') : schema.required))
              : new Property(m[1], dataType.library.get(schema),
                  (m[2] ? (m[2] === '!') : schema.required));
          return dataType.properties[m[1]] = prop;
        };
        dataType.properties = dataType.properties || {};
        if (Array.isArray(v))
          v.forEach(p => addProperty(p.name, p));
        else
          for (const k of Object.keys(v))
            addProperty(k, v[k]);
        return;
      }
    }
    super.set(attr, v);
  }

  prepareCompileOptions(options) {
    const o = super.prepareCompileOptions(options);
    o.coerceTypes = coerceToBool(options.coerceTypes);
    o.removeAdditional = coerceToBool(options.removeAdditional);
    o.removeNull = coerceToBool(options.removeNull);
    o.maxObjectErrors = coerceToInt(options.maxObjectErrors);
    o.operation = coerceToString(options.operation);
    return o;
  }

  _generateValidationCode(dataType, options) {
    const data = super._generateValidationCode(dataType, options);
    const discriminator = data.variables.discriminator = dataType.discriminator;
    if (discriminator)
      data.variables.discriminatorValue =
          dataType.discriminatorValue || dataType.name;

    const isTypeOf = dataType.isTypeOf;
    if (isTypeOf)
      data.variables.isTypeOf = isTypeOf;

    let additionalProperties = !options.removeAdditional &&
        dataType.additionalProperties;
    if (additionalProperties == null)
      additionalProperties =
          dataType.library.defaults.additionalProperties != null ?
              dataType.library.defaults.additionalProperties : true;
    if (typeof additionalProperties !== 'boolean')
      additionalProperties =
          dataType.library.get(additionalProperties).compile(options);

    data.variables.additionalProperties = additionalProperties;
    data.variables.operation = options.operation;
    data.variables.removeNull = options.removeNull;
    const minProperties = dataType.minProperties;
    const maxProperties = dataType.maxProperties;
    const maxErrors = data.variables.maxErrors = options.maxObjectErrors || 0;

    const properties = dataType.properties;

    const propertyKeys = (properties && Object.keys(properties)) || [];
    let propFns;
    let rxproperties;
    if (propertyKeys.length) {
      data.variables.propertyKeys = propertyKeys;
      propFns = data.variables.properties = {};
      rxproperties = data.variables.rxproperties = [];
      const opts = maxErrors > 1 ? {...options, throwOnError: false} : options;
      for (const k of propertyKeys) {
        const property = properties[k];
        const m = k.match(/^\/(.*)\/$/);
        if (m) {
          rxproperties.push({
            property,
            fn: property.dataType.factory._generateFunction(property.dataType, opts),
            regexp: m && new RegExp(m[1]),
            required: property.required
          });
        }
        propFns[k] = {
          property,
          fn: property.dataType.factory._generateFunction(property.dataType, opts),
          regexp: m && new RegExp(m[1]),
          required: property.required
        };
      }
    }
    const needResult = propFns && options.coerceTypes ||
        options.removeAdditional || options.removeNull;

    data.code += `        
    if (typeof value !== 'object' || Array.isArray(value))
        return unionMatch ? Failed : 
            ctx.logError({
                message: 'Value'+(path ? ' at '+ path: '')+' must be an object',
                errorType: 'invalid-data-type'
            }
        );`;

    if (isTypeOf)
      data.code += `
    if (!isTypeOf(value, dataType))
        return unionMatch ? Failed : 
            ctx.logError({
                message: (path ? path: 'Value') + ' does not match'+
                    (name ? 'to "' + name + '"' : ''),
                errorType: 'invalid-data-type'
            });
`;

    if (discriminator)
      data.code += `
    if (value[discriminator] !== discriminatorValue)
        return unionMatch ? Failed : ctx.logError({
            message: (path ? path: 'Value') + 
                ' is not a type of "' + discriminatorValue + '"',
            errorType: 'invalid-data',
            error,
            discriminatorValue,
            actual: value[discriminator],
        });`;

    if (!additionalProperties || minProperties || maxProperties || propFns)
      data.code += `    
    const valueKeys = Object.keys(value);`;

    if (propFns) {
      data.code += `
    if (unionMatch) {
      let matchedCount = 0;
      const xctx = {...ctx};     
      for (let i = 0; i < ${propertyKeys.length}; i++) {
        const k = propertyKeys[i];
        const p = properties[k];
        const regexp = p.regexp;       
        if (regexp) {
          xctx.name = k;
          const len = valueKeys.length;
          let h = 0;
          for (let j = 0; j < len; j ++) {
            if (valueKeys[j].match(regexp) && 
                p.fn(value[valueKeys[j]], '', error, xctx) !== Failed)
              h++;
          }
          matchedCount += (h / len);    
          continue;
        } else if (value.hasOwnProperty(k)) {
          if (p.fn(value[k], '', error, {...ctx, name: k}) !== Failed)
            matchedCount++;
        } else
          if (p.required && (!Array.isArray(p.required) || p.required.includes(operation))) 
            return Failed;               
      }      
      return matchedCount / ${propertyKeys.length};  
    }
    `;
    }

    data.code += `    
    if (unionMatch) return;`;

    if (minProperties) {
      data.code += `
    if (valueKeys.length < ${minProperties})
        return ctx.logError({
            message: 'Minimum accepted properties'+(path ? ' at '+ path: '')+
                ' is ${minProperties}, actual ' + valueKeys.length, 
            errorType: 'invalid-value-length',
            min: ${minProperties},
            actual: valueKeys.length
        });`;
    }
    if (maxProperties)
      data.code += `
    if (valueKeys.length > ${maxProperties})
        return ctx.logError({
            message: 'Maximum accepted properties'+(path ? ' at '+ path: '')+
                ' is ${maxProperties}, actual ' + valueKeys.length, 
            errorType: 'invalid-value-length',
            max: ${maxProperties},
            actual: valueKeys.length
        });`;

    // Iterate over value properties than iterate over type properties
    if (propFns) {
      data.code += `
                  
    let numErrors = 0;        
    const subError = (...args) => {
      numErrors++;
      return ctx.logError(...args);
    };
    
    ${needResult ? 'const result = {};' : ''}        
    const xprops = Object.assign({}, properties);
    let keysLen = valueKeys.length;
    const xctx = {...ctx}
    for (let i = 0; i < keysLen; i++) {
      const k = valueKeys[i];
      const p = properties[k] || (
          rxproperties.length &&
          rxproperties.find(x=> k.match(x.regexp)))
      const _path = (path ? path + ' > ' + k : k);
      let vv;                           
      if (p) {          
          delete xprops[k];
          xctx.name = k;
          vv = p.fn(value[k], _path, subError, xctx);
      }`;

      if (additionalProperties) {
        if (additionalProperties instanceof AnyType) {
          data.code += ` else {
        xctx.name = k;
        vv = additionalProperties(value[k], _path, subError, xctx);            
      }`;
        } else if (needResult)
          data.code += ' else vv = value[k]';
      } else
        data.code += ' else vv = Failed;';

      if (!options.removeAdditional)
        data.code += `
      if (vv === Failed) {
          ctx.logError({
                  message: 'Additional property "' + k + '" is not allowed.',
                  errorType: 'no-additional-allowed'
              }
          );
          ${maxErrors > 1 ?
            'if (++numErrors >= maxErrors) return Failed;' : 'return Failed;'}
      }`;

      if (needResult)
        data.code += `
      if (vv !== undefined && vv !== Failed && (vv != null || !removeNull)) result[k] = vv;`;
      data.code += `
    }
      
    const keys = Object.keys(xprops);
    keysLen = keys.length;
    for (let i = 0; i < keysLen; i++) {
      const k = keys[i];
      const p = xprops[k];
      if (p.regexp)
        continue;
      let vv = value[k];
      const _path = (path ? path + ' > ' + k : k);         
      if (!removeNull && vv == null && 
          p.required && (!Array.isArray(p.required) || p.required.includes(operation))
      ) {
         ctx.logError({
                  message: 'Value required.',
                  errorType: 'value-required'
              }
          );
          ${maxErrors > 1 ?
          'if (++numErrors >= maxErrors) return Failed;' : 'return Failed;'}
      }   
      const n = numErrors;
      vv = p.fn(vv, _path, subError, {...ctx, name: k});
      if (numErrors > n)
        ${maxErrors > 1 ?
          'if (numErrors >= maxErrors) return Failed;' :
          'return Failed;'}
      ${needResult ? 'if (vv !== undefined && (vv != null || !removeNull)) result[k] = vv;' : ''}                    
    }
      `;
    }
    if (needResult)
      data.code += '\n    value = !numErrors ? result: undefined;';

    return data;
  }
}

class Property {

  constructor(name, dataType, required) {
    this.name = name;
    this.dataType = dataType;
    this.required = typeof required === 'string' ? [required] :
        required;
  }

}

module.exports = ObjectType;
