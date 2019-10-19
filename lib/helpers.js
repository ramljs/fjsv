function normalizeTypeSchema(def, defaultType) {
  if (typeof def === 'string') {
    const x = parseTypeName(def);
    return typeof x === 'object' ? x : {type: def};
  }

  if (typeof def.type === 'string') {
    def.type = parseTypeName(def.type);
    if (typeof def.type === 'object')
      Object.assign(def, def.type);
  }

  if (Array.isArray(def.type)) {
    if (def.type.length < 2)
      return normalizeTypeSchema({...def, type: def.type[0]});
    def.type = def.type.map(t =>
        typeof t === 'string' ? parseTypeName(t) : t);
    return def;
  }

  if (!def.type)
    return {
      ...def,
      type: (def.properties ? 'object' : defaultType || /*istanbul ignore next*/
          'string')
    };

  return def;
}

function parseTypeName(v) {
  const parse = (v) => {
    if (v.includes('|')) {
      return {
        type: 'union',
        anyOf: v.split(/\s*\|\s*/).map(parseTypeName)
      };
    }
    if (v.endsWith('[]')) {
      const n = parseTypeName(v.substring(0, v.length - 2));
      return {
        type: 'array',
        items: n
      };
    }
    if (v.endsWith('{}')) {
      const n = parseTypeName(v.substring(0, v.length - 2));
      return {
        type: 'object',
        properties: {
          '/.+/': n
        }
      };
    }
    return v;
  };
  const m = v.match(/^\[([^\]]+)]$/);
  const x = m ? m[1].split(/\s*,\s*/).map(parse) : parse(v);
  return Array.isArray(x) && x.length < 2 ? x[0] : x;
}

function isValidDate(d) {
  return d && !isNaN(d.getTime());
}

function fastParseInt(str) {
  /* istanbul ignore next */
  if (typeof str === 'number')
    return Math.floor(str);
  const strLength = str.length;
  let res = 0;
  let i = 0;
  do {
    const charCode = str.charCodeAt(i);
    /* istanbul ignore next */
    if (charCode === 46)
      return res;
    /* istanbul ignore next */
    if (charCode < 48 || charCode > 57)
      return NaN;
    res *= 10;
    res += (charCode - 48);
  } while (++i < strLength);
  return res;
}

function deepResolvePromises(obj) {
  if (obj instanceof Promise)
    return Promise.resolve(obj)
        .then(v => deepResolvePromises(v));

  const promises = [];

  function visitObj(v) {
    if (Array.isArray(v)) {
      const len = v.length;
      for (let i = 0; i < len; i++) {
        if (v[i] instanceof Promise) {
          promises.push(v[i].then((x) => v[i] = x));
        } else
          visitObj(v[i]);
      }
    } else if (typeof v === 'object') {
      for (const k of Object.keys(v)) {
        if (v[k] instanceof Promise) {
          promises.push(v[k].then((x) => v[k] = x));
        } else
          visitObj(v[k]);
      }
    }
  }

  visitObj(obj);
  return promises.length ?
      Promise.all(promises).then(
          () => deepResolvePromises(obj)) :
      obj;
}

module.exports = {
  parseTypeName,
  normalizeTypeSchema,
  isValidDate,
  fastParseInt,
  deepResolvePromises
};
