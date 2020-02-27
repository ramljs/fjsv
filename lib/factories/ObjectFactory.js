'use strict';

const {AnyFactory} = require('./AnyFactory');
const {coalesce, coerceToString, coerceToInt, coerceToBool} = require('../helpers');

class ObjectFactory extends AnyFactory {

  normalizeCompileOptions(options) {
    const o = super.normalizeCompileOptions(options);
    o.coerceTypes = coerceToBool(options.coerceTypes);
    o.removeAdditional = coerceToBool(options.removeAdditional);
    o.removeNull = coerceToBool(options.removeNull);
    o.maxObjectErrors = coerceToInt(options.maxObjectErrors);
    o.operation = coerceToString(options.operation);
    return o;
  }

  normalizeAttribute(attr, v) {
    switch (attr) {
      case 'discriminator':
        return coerceToString(v);
      case 'discriminatorValue':
      case 'additionalProperties':
        return v;
      case 'minProperties':
      case 'maxProperties':
        return coerceToInt(v);
      case 'isTypeOf':
        if (v && typeof v !== 'function')
          throw new TypeError('Value must be a Function.');
        return v;
      case 'properties':
        return v;
    }
    return super.normalizeAttribute(attr, v);
  }

  _generateValidationCode(dataType, options, orgOptions) {
    const data = super._generateValidationCode(dataType, options);
    const maxErrors = data.variables.maxErrors = options.maxObjectErrors || 0;
    const propOptions = maxErrors > 1 ? {
      ...orgOptions,
      throwOnError: false
    } : orgOptions;

    // Merge all properties together
    const properties = {};
    const mergeProperties = (dt) => {
      if (dt.predecessors) {
        for (const t of dt.predecessors) {
          mergeProperties(t);
        }
      }
      if (dt.properties) {
        for (const [k, p] of Object.entries(dt.properties)) {
          properties[k] = p;
        }
      }
    };
    mergeProperties(dataType);

    const propertyKeys = (properties && Object.keys(properties)) || [];
    let propFns;
    let rxproperties;
    if (propertyKeys.length) {
      data.variables.propertyKeys = propertyKeys;
      propFns = data.variables.properties = {};
      rxproperties = data.variables.rxproperties = [];
      for (const k of propertyKeys) {
        const property = properties[k];
        const required = property.required != null ? property.required :
            (dataType.options.required != null ?
                dataType.options.required : true);
        const fn = property.generate(propOptions);
        const m = k.match(/^\/(.*)\/$/);
        const regexp = m && new RegExp(m[1]);
        propFns[k] = {
          property,
          fn,
          required,
          regexp
        };
        if (regexp)
          rxproperties.push(propFns[k]);
      }
    }

    const discriminator = data.variables.discriminator =
        dataType.get('discriminator');
    if (discriminator)
      data.variables.discriminatorValue =
          dataType.get('discriminatorValue') || dataType.name;

    const isTypeOf = dataType.get('isTypeOf');
    if (isTypeOf)
      data.variables.isTypeOf = isTypeOf;

    const library = dataType.library;

    let additionalProperties = coalesce(
        dataType.get('additionalProperties'),
        dataType.options.additionalProperties, true);
    additionalProperties = !propertyKeys.length ||
        (!options.removeAdditional && additionalProperties);

    if (typeof additionalProperties !== 'boolean')
      additionalProperties =
          library.getType(additionalProperties)
              .generate({...propOptions, strictFormat: true});

    data.variables.additionalProperties = additionalProperties;
    data.variables.operation = options.operation;
    data.variables.removeNull = options.removeNull;
    const minProperties = dataType.get('minProperties');
    const maxProperties = dataType.get('maxProperties');

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

    if (discriminator) {
      data.code += `
    if (value[discriminator] !== discriminatorValue) {        
        return typeCheck ? Failed : ctx.logError({
            message: 'Value is not a type of "' + discriminatorValue + '"',
            errorType: 'invalid-data',            
            discriminatorValue,
            actual: value[discriminator],
        });        
    }
    if (typeCheck) return 1;`;
    }

    if (!additionalProperties || minProperties || maxProperties || propFns)
      data.code += `    
    const valueKeys = Object.keys(value);`;

    if (!discriminator && propFns) {
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
          path.push(k);                 
          ctx.logError({
                  message: 'Additional property "' + k + '" is not allowed.',
                  errorType: 'no-additional-allowed'
              }
          );
          ${propFns && maxErrors > 1 ?
          'if (++numErrors >= maxErrors) return Failed;' : 'return Failed;'}
          path.pop();
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

module.exports = {ObjectFactory};
