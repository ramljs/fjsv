'use strict';

const DataType = require('../DataType');
const {normalizeTypeSchema} = require('../helpers');

class ObjectType extends DataType {

  constructor(library) {
    super(library);
    this.properties = {};
    this.attributes.discriminator = undefined;
    this.attributes.discriminatorValue = undefined;
    this.attributes.additionalProperties = undefined;
    this.attributes.minProperties = undefined;
    this.attributes.maxProperties = undefined;
    this.attributes.isTypeOf = undefined;
  }

  get discriminator() {
    return this.attributes.discriminator;
  }

  set discriminator(v) {
    this.attributes.discriminator = v == null ? v : ('' + v);
  }

  get discriminatorValue() {
    return this.attributes.discriminatorValue;
  }

  set discriminatorValue(v) {
    this.attributes.discriminatorValue = v;
  }

  get additionalProperties() {
    return this.attributes.additionalProperties;
  }

  set additionalProperties(v) {
    this.attributes.additionalProperties = v == null ? v : !!v;
  }

  get minProperties() {
    return this.attributes.minProperties;
  }

  set minProperties(v) {
    if (v == null) {
      this.attributes.minProperties = v;
      return;
    }
    const x = parseInt(v, 10);
    if (isNaN(x))
      throw new TypeError(`"${v}" is not a valid number value for minProperties attribute`);
    this.attributes.minProperties = x;
  }

  get maxProperties() {
    return this.attributes.maxProperties;
  }

  set maxProperties(v) {
    if (v == null) {
      this.attributes.maxProperties = v;
      return;
    }
    const x = parseInt(v, 10);
    if (isNaN(x))
      throw new TypeError(`"${v}" is not a valid number value for maxProperties attribute`);
    this.attributes.maxProperties = x;
  }

  get isTypeOf() {
    return this.attributes.isTypeOf;
  }

  set isTypeOf(v) {
    if (v && typeof v !== 'function')
      throw new TypeError('Function type required for "isTypeOf" attribute');
    this.attributes.isTypeOf = v;
  }

  assign(values, overwrite) {
    super.assign(values, overwrite);
    this._assignAttributes(['discriminator', 'discriminatorValue',
      'additionalProperties', 'minProperties', 'maxProperties',
      'isTypeOf'], values, overwrite);
    if (values.properties) {
      for (const k of Object.keys(values.properties)) {
        /* istanbul ignore else */
        if (!this.properties[k] ||
            /* istanbul ignore next */ (overwrite || overwrite == null)) {
          let p = values.properties[k];
          if (this.isExtension) {
            p = {
              type: p,
              isExtension: true
            };
          }
          this.addProperty(k, p);
        }
      }
    }
  }

  clone() {
    const t = super.clone();
    Object.assign(t.properties, this.properties);
    return t;
  }

  bake() {
    if (this._baking)
      return this;
    this._baking = true;
    try {
      super.bake();
      for (const k of Object.keys(this.properties)) {
        let prop = this.properties[k];
        prop = prop instanceof DataType ? prop : this.library.get(prop);
        prop = prop.bake();
        if (this.properties[k].isExtension)
          prop.isExtension = true;
        this.properties[k] = prop;
      }
    } finally {
      delete this._baking;
    }
    return this;
  }

  addProperty(name, prop) {
    const m = name.match(/^([^?!]+)([?|!])?$/);
    name = m[1];
    const required = m[2] === '?' ? false :
        (m[2] === '!' ? true : undefined);
    if (required !== undefined) {
      if (typeof prop === 'string') {
        prop = normalizeTypeSchema(prop, this.library.defaults.type);
        prop.required = required;
      } else
        prop = {...prop, required};
    }
    this.properties[name] = prop;
    return prop;
  }

  addProperties(properties) {
    if (Array.isArray(properties)) {
      properties.forEach(p => this.addProperty(p.name, p));
      return this;
    }
    for (const k of Object.keys(properties))
      this.addProperty(k, properties[k]);
    return this;
  }

  _getDiscriminator() {
    return this.discriminator;
  }

  _getDiscriminatorValue() {
    return this.discriminatorValue || this.name;
  }

  _getAdditionalProperties() {
    return this.additionalProperties != null ? this.additionalProperties :
        (this.library.defaults.additionalProperties != null ?
            /* istanbul ignore next */
            this.library.defaults.additionalProperties : true);
  }

  _getIsTypOf() {
    return this.isTypeOf;
  }

  _getMinProperties() {
    return parseInt(this.minProperties, 10) || 0;
  }

  _getMaxProperties() {
    return parseInt(this.maxProperties, 10) || 0;
  }

  _generateValidationCode(options, context) {
    const data = super._generateValidationCode(options, context);
    const discriminator = data.variables.discriminator =
        this._getDiscriminator();
    if (discriminator)
      data.variables.discriminatorValue = this._getDiscriminatorValue();
    const isTypeOf = this._getIsTypOf();
    if (isTypeOf) {
      data.variables.isTypeOf = isTypeOf;
      data.variables.type = this;
    }
    const additionalProperties = !options.removeAdditional &&
        this._getAdditionalProperties();
    const minProperties = this._getMinProperties();
    const maxProperties = this._getMaxProperties();
    const maxErrors = data.variables.maxErrors = options.maxObjectErrors || 0;

    const propertyKeys = Object.keys(this.properties);
    let properties;
    let rxproperties;
    let hasExtension = false;
    if (propertyKeys.length) {
      data.variables.propertyKeys = propertyKeys;
      properties = data.variables.properties = {};
      rxproperties = data.variables.rxproperties = [];
      const opts = maxErrors > 1 ? {...options, throwOnError: false} : options;
      for (const k of propertyKeys) {
        const property = context.wrap(
            (this.properties[k] instanceof DataType ? this.properties[k] :
                this.library.get(this.properties[k]))
        );
        hasExtension = hasExtension || property.isExtension;
        const m = k.match(/^\/(.*)\/$/);
        if (m) {
          rxproperties.push({
            type: property,
            fn: property._generateValidateFunction(opts, context),
            regexp: m && new RegExp(m[1])
          });
          continue;
        }
        const ignoreRequire =
            (Array.isArray(opts.ignoreRequire) &&
                opts.ignoreRequire.includes(k)) ||
            (!Array.isArray(opts.ignoreRequire) && opts.ignoreRequire);
        properties[k] = {
          type: property,
          fn: property._generateValidateFunction({
            ...opts,
            ignoreRequire
          }, context),
          regexp: m && new RegExp(m[1])
        };
      }
    }
    const needResult = properties && options.coerceTypes ||
        options.removeAdditional;

    data.code += `
    path = path || 'Object type';
    if (typeof value !== 'object' || Array.isArray(value))
        return error({
                message: 'Value'+(path ? ' for '+ path: '')+' must be an object',
                errorType: 'invalid-data-type',
                path
            }
        );`;

    if (this.isTypeOf)
      data.code += `
      if (!isTypeOf(value, type))
        return Failed;
`;

    if (discriminator)
      data.code += `
    if (value[discriminator] !== discriminatorValue)
        return error({
            message: (path ? path: 'Object') + ' type requires '+ discriminator + 
                ' property equal to "' + discriminatorValue + '"',
            errorType: 'invalid-data',
            error,
            discriminatorValue,
            actual: value[discriminator],
        });`;

    if (!additionalProperties || minProperties || maxProperties || properties)
      data.code += `    
    const valueKeys = Object.keys(value);`;

    if (minProperties) {
      data.code += `
    if (valueKeys.length < ${minProperties})
        return error({
            message: 'Minimum accepted properties'+(path ? ' for '+ path: '')+
                ' is ${minProperties}, actual ' + valueKeys.length, 
            errorType: 'invalid-value-length',
            path,
            min: ${minProperties},
            actual: valueKeys.length
        });`;
    }
    if (maxProperties)
      data.code += `
    if (valueKeys.length > ${maxProperties})
        return error({
            message: 'Maximum accepted properties'+(path ? ' for '+ path: '')+
                ' is ${maxProperties}, actual ' + valueKeys.length, 
            errorType: 'invalid-value-length',
            path,
            max: ${maxProperties},
            actual: valueKeys.length
        });`;

    // Iterate over value properties than iterate over type properties
    if (properties) {
      data.code += `      
    ${hasExtension ? `
    for (let i = 0; i < ${propertyKeys.length}; i++) {
      const k = propertyKeys[i];
      const p = properties[k];
      if (p.type.isExtension) {
        if (p.regexp) {
          if (!valueKeys.find(x => x.match(p.regexp)))
            return Failed;
        } else          
            if (!value.hasOwnProperty(k)) return Failed;
      }      
    }` : ''}
      
    let numErrors = 0;        
    const subError = (...args) => {
      numErrors++;
      return error(...args);
    };
    
    ${needResult ? 'const result = {};' : ''}        
    const prpVlds = Object.assign({}, properties);
    let keysLen = valueKeys.length;
    for (let i = 0; i < keysLen; i++) {
      const k = valueKeys[i];
      const _path = path ? path + ' > ' + k : k;
      const p = properties[k] || (
          rxproperties.length &&
          rxproperties.find(x=> k.match(x.regexp)))                           
      if (p) {          
          delete prpVlds[k];
          const vv = p.fn(value[k], _path, subError, {name: k});
          if (vv === Failed) {
              ${maxErrors > 1 ? `if (numErrors >= maxErrors) return Failed;
              continue;` : 'return Failed;'}
          }                                   
          ${needResult ? 'result[k] = vv;' : ''}                           
        }`;
      if (additionalProperties) {
        if (needResult)
          data.code += ` else result[k] = value[k];`;
      } else if (!options.removeAdditional)
        data.code += ` else {
            error({
                    message: path + ' does not allow additional property ('+
                        k +')',
                    errorType: 'no-additional-allowed',
                    path: _path
                }
            );
            ${maxErrors > 1 ?
            'if (++numErrors >= maxErrors) return Failed;' : 'return Failed;'}
        }`;

      data.code += `
      }
      
      const keys = Object.keys(prpVlds);
      keysLen = keys.length;
      for (let i = 0; i < keysLen; i++) {
        const k = keys[i];
        const p = prpVlds[k];
        if (p.regexp)
          continue;          
        const _path = path ? path + ' > ' + k : k;
        const n = numErrors;
        const vv = p.fn(value[k], _path, subError, {name: k});
        if (numErrors > n)
          ${maxErrors >
      1 ? 'if (numErrors >= maxErrors) return Failed;' : 'return Failed;'}
        ${needResult ? 'if (vv !== undefined) result[k] = vv;' : ''}                    
      }
      `;
    }
    if (needResult)
      data.code += '\n    value = !numErrors ? result: undefined;';

    return data;
  }
}

module.exports = ObjectType;
