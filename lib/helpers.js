function normalizeTypeDef(def, defaultType) {
  if (typeof def === 'string') {
    const x = parseTypeName(def);
    return typeof x === 'object' ? x : {type: def};
  }
  if (typeof def === 'string')
    return parseTypeName(def);

  if (Array.isArray(def.type) && def.type.length < 2)
    return {...def, type: def.type[0]};

  if (Array.isArray(def.type))
    return def;

  if (!def.type)
    return {
      ...def,
      type: (def.properties ? 'object' : defaultType || 'string')
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
  return v.match(/^\[[^\]]+]$/) ?
      v.split(/\s*,\s*/).map(parse) : parse(v);
}

function coalesce(...values) {
  let l = values.length;
  for (let i = 0; i < l; i++) {
    let v = values[i];
    if (v != null)
      return v;
  }
}

function isValidDate(d) {
  return d && !isNaN(d.getTime());
}

function fastParseInt(str) {
  const strLength = str.length;
  let res = 0;
  let i = 0;
  do {
    const charCode = str.charCodeAt(i);
    if (charCode < 48 || charCode > 57)
      return NaN;
    res *= 10;
    res += (charCode - 48);
  } while (++i < strLength);
  return res;
}

module.exports = {
  parseTypeName,
  normalizeTypeDef,
  coalesce,
  isValidDate,
  fastParseInt
};
