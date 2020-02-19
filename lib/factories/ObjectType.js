'use strict';

const {AnyType} = require('./AnyType');
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
          let required = m[2] === '!' ? true :
              (m[2] === '?' ? false :
                  (typeof schema === 'object' && schema.required != null ?
                      schema.required :
                      dataType.library.defaults.propertiesRequired));
          const prop = new Property(m[1],
              (schema instanceof Property ?
                  schema.dataType : dataType.library._create(schema)),
              required);

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

  _generateValidationCode(dataType, options, orgOptions) {
    const data = super._generateValidationCode(dataType, options);
    const maxErrors = data.variables.maxErrors = options.maxObjectErrors || 0;
    const propOptions = maxErrors > 1 ? {
      ...orgOptions,
      throwOnError: false
    } : orgOptions;

    const properties = dataType.properties;
    const propertyKeys = (properties && Object.keys(properties)) || [];
    let propFns;
    let rxproperties;
    if (propertyKeys.length) {
      data.variables.propertyKeys = propertyKeys;
      propFns = data.variables.properties = {};
      rxproperties = data.variables.rxproperties = [];
      for (const k of propertyKeys) {
        const property = properties[k];
        const m = k.match(/^\/(.*)\/$/);
        if (m) {
          rxproperties.push({
            property,
            fn: property.dataType.generate(propOptions),
            regexp: m && new RegExp(m[1]),
            required: property.required
          });
        }
        propFns[k] = {
          property,
          fn: property.dataType.generate(propOptions),
          regexp: m && new RegExp(m[1]),
          required: property.required
        };
      }
    }

    const discriminator = data.variables.discriminator = dataType.discriminator;
    if (discriminator)
      data.variables.discriminatorValue =
          dataType.discriminatorValue || dataType.name;

    const isTypeOf = dataType.isTypeOf;
    if (isTypeOf)
      data.variables.isTypeOf = isTypeOf;

    let additionalProperties = !propertyKeys.length ||
        (!options.removeAdditional && dataType.additionalProperties);
    if (additionalProperties == null)
      additionalProperties =
          dataType.library.defaults.additionalProperties != null ?
              dataType.library.defaults.additionalProperties : true;
    if (typeof additionalProperties !== 'boolean')
      additionalProperties =
          dataType.library._create(additionalProperties)
              .generate({...propOptions, strictFormat: true});

    data.variables.additionalProperties = additionalProperties;
    data.variables.operation = options.operation;
    data.variables.removeNull = options.removeNull;
    const minProperties = dataType.minProperties;
    const maxProperties = dataType.maxProperties;

    const needResult = options.coerceTypes ||
        options.removeAdditional || options.removeNull;

    data.code += `
    if (typeof value !== 'object' || Array.isArray(value)) {        
        return typeCheck ? Failed : 
            ctx.logError({
                message: 'Value must be an object',
                errorType: 'invalid-data-type'
            }
        );
    }`;

    if (isTypeOf)
      data.code += `
    if (!isTypeOf(value, dataType)) {        
        return typeCheck ? Failed : 
            ctx.logError({
                message: 'Value does not match to'+
                    (name ? 'to "' + name + '"' : ''),
                errorType: 'invalid-data-type'
            });
    }`;

    if (discriminator)
      data.code += `
    if (value[discriminator] !== discriminatorValue) {        
        return typeCheck ? Failed : ctx.logError({
            message: 'Value is not a type of "' + discriminatorValue + '"',
            errorType: 'invalid-data',            
            discriminatorValue,
            actual: value[discriminator],
        });
    }`;

    if (!additionalProperties || minProperties || maxProperties || propFns)
      data.code += `    
    const valueKeys = Object.keys(value);`;

    if (propFns) {
      data.code += `
    if (typeCheck) {
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
                p.fn(value[valueKeys[j]], xctx).valid)
              h++;
          }
          matchedCount += (h / len);    
          continue;
        } else if (value.hasOwnProperty(k)) {
          xctx.name = k;
          if (p.fn(value[k], xctx).valid)
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
    if (typeCheck) return;
    let numErrors = 0;
    ${needResult ? 'const result = {};' : ''}`;

    if (minProperties) {
      data.code += `
    if (valueKeys.length < ${minProperties}) {        
        return ctx.logError({
            message: 'Minimum accepted properties is ${minProperties}, actual ' + valueKeys.length, 
            errorType: 'invalid-value-length',
            min: ${minProperties},
            actual: valueKeys.length
        });
    }`;
    }
    if (maxProperties)
      data.code += `
    if (valueKeys.length > ${maxProperties}) {        
        return ctx.logError({
            message: 'Maximum allowed properties is ${maxProperties}, actual ' + valueKeys.length, 
            errorType: 'invalid-value-length',
            max: ${maxProperties},
            actual: valueKeys.length
        });
    }`;

    if (!propFns && additionalProperties === true) {
      data.code += `
    ${needResult ? 'return value;' : 'return;'}`;
    }

    // Iterate over value properties than iterate over type properties
    if (propFns) {
      data.code += `                  
    const _logError = (...args) => {
      numErrors++;
      return ctx.logError(...args);
    };
                
    const xprops = Object.assign({}, properties);
    let keysLen = valueKeys.length;
    const xctx = {...ctx, logError: _logError}
    const path = ctx.path;
    for (let i = 0; i < keysLen; i++) {
      const k = valueKeys[i];
      const p = properties[k] || (
          rxproperties.length &&
          rxproperties.find(x=> k.match(x.regexp)))      
      let vv;                           
      if (p) {          
          delete xprops[k];
          xctx.name = k;
          path.push(k);
          vv = p.fn(value[k], xctx);
          ${maxErrors > 1 ? 'if (numErrors >= maxErrors) return Failed;' : ''}
          if (!vv.valid) vv = Failed;${needResult ? ' else vv = vv.value;' : ''};
          path.pop();
      }`;

      if (additionalProperties) {
        if (typeof additionalProperties === 'function') {
          data.code += ` else {
          path.push(k);
          xctx.name = k;         
          xctx.typeCheck = true;
          vv = additionalProperties(value[k], {...xctx, typeCheck: true});
          xctx.typeCheck = undefined;
          if (!vv.valid) vv = Failed;${needResult ? 'else vv = vv.value;' : ''}        
          path.pop();            
      }`;
        } else if (needResult)
          data.code += ' else vv = value[k]';
      } else if (!options.removeAdditional)
        data.code += ' else vv = Failed;';

      data.code += `
      if (!p && vv === Failed) {                 
          ctx.logError({
                  message: 'Additional property "' + k + '" is not allowed.',
                  errorType: 'no-additional-allowed'
              }
          );
          ${propFns && maxErrors > 1 ?
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
      path.push(k);         
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
      xctx.name = k;
      vv = p.fn(vv, xctx);
      if (!vv.valid) {
        ${maxErrors > 1 ?
          'if (numErrors >= maxErrors) return Failed;' :
          'return Failed;'}
      }${needResult ? `
      vv = vv.value;
      if (vv !== undefined && (vv != null || !removeNull)) result[k] = vv;` : ''}
      path.pop();                    
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
    this.required = typeof required === 'string' ?
        required.split(/\s*,\s*/) : required;
  }

}

module.exports = {ObjectType};
