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

const SQUAREBRACKETS_PATTERN1 = /^\[([^\]]+)]$/;
const TYPENAME_PATTERN = /^([^?!]+)([?!])?$/;

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
    const m = v.match(TYPENAME_PATTERN);
    if (m[2])
      return {
        type: m[1],
        required: m[2] !== '?'
      };
    return v;
  };
  const m = v.match(SQUAREBRACKETS_PATTERN1);
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

module.exports = {
  parseTypeName,
  normalizeTypeSchema,
  isValidDate,
  fastParseInt
};
