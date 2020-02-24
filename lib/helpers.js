function coalesce(...args) {
  for (let i = 0; i < args.length; i++)
    if (args[i] != null)
      return args[i];
}

function coerceToBool(v, def) {
  if (v == null)
    v = def !== undefined ? def : v;
  return v == null ? v : !!v;
}

function coerceToString(v, def) {
  if (v == null)
    v = def !== undefined ? def : v;
  return v == null ? v : '' + v;
}

function coerceToInt(v, def) {
  if (v == null)
    v = def !== undefined ? def : v;
  if (v == null)
    return v;
  const x = parseInt(v, 10);
  if (isNaN(x))
    throw new TypeError(`"${v}" is not a valid integer value.`);
  return x;
}

function coerceToNumber(v, def) {
  if (v == null)
    v = def !== undefined ? def : v;
  if (v == null)
    return v;
  const x = parseFloat(v);
  if (isNaN(x))
    throw new TypeError(`"${v}" is not a valid number value.`);
  return x;
}

function coerceToArray(v, def) {
  if (v == null)
    v = def !== undefined ? def : v;
  if (v == null)
    return v;
  return Array.isArray(v) ? v : [v];
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

function mapDistinct(arr, cb) {
  return arr.reduce((a, x) => {
    x = cb(x);
    /* istanbul ignore else */
    if (x != null && !a.includes(x))
      a.push(x);
    return a;
  }, []);
}

module.exports = {
  coalesce,
  coerceToBool,
  coerceToString,
  coerceToInt,
  coerceToNumber,
  coerceToArray,
  mapDistinct,
  isValidDate,
  fastParseInt
};
