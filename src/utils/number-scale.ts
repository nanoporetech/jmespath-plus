export interface NumberScaleOptions {
  precision: number;
  roundMode?: 'even' | 'odd' | 'up' | 'down';
  scale: string;
  unit: string;
  recursive: number;
}

export interface ScaleDefinitions {
  [scaleKey: string]: Scale;
}

export interface Scale {
  list: ScaleUnit[];
  map: {
    [unit: string]: number;
  };
  re: RegExp;
  base: number | string;
}

export type ScaleUnit = [string, number];

export interface ScalePrefixDefinition {
  [unit: string]: number;
}

/**
 * The default options
 *
 * @namespace defaultOptions
 * @property {Number}  precision         the decimal precision to display (0 for integers only)
 * @property {string}  roundMode         one of `even`, `odd`, `up`, `down`, or any other value
 * @property {string}  scale             the scale key to use
 * @property {string}  unit              the unit suffix to display
 * @property {Number}  recursive         a positive integer to recursively decompose the value into scale fragments
 * @see formatPrecision
 * @see round
 */
const defaultOptions: NumberScaleOptions = {
  //maxExponent: 308,
  //minExponent: -324,
  precision: 2,
  roundMode: 'up',
  scale: 'SI',
  unit: '',
  recursive: 0,
};
/* @private */
const defaultOptionsKeys = Object.keys(defaultOptions);
/**
 * All known scales
 *
 * @namespace
 * @private
 * @property {Object}  SI        International System of Units (https://en.wikipedia.org/wiki/International_System_of_Units)
 * @property {Object}  time      Time Unit scale
 * @property {object}  IEEE1541  IEEE 1541 Units for bytes measurements
 */
const knownScales: ScaleDefinitions = {
  SI: buildScale(
    {
      y: 1e-24,
      z: 1e-21,
      a: 1e-18,
      f: 1e-15,
      p: 1e-12,
      n: 1e-9,
      µ: 1e-6,
      m: 1e-3,
      '': 1,
      k: 1e3,
      M: 1e6,
      G: 1e9,
      T: 1e12,
      P: 1e15,
      E: 1e18,
      Z: 1e21,
      Y: 1e24,
    },
    1,
  ),
  time: buildScale(
    {
      ns: 1e-9,
      ms: 1e-3,
      s: 1,
      m: 60,
      h: 3600, // 60*60
      d: 86400, // 60*60*24
    },
    1,
  ),
  IEEE1541: buildScale(
    {
      '': 1,
      Ki: 1e3,
      Mi: 1e6,
      Gi: 1e9,
      Ti: 1e12,
      Pi: 1e15,
      Ei: 1e18,
      Zi: 1e21,
      Yi: 1e24,
    },
    0,
  ),
};

/**
 * Return an object with all the required options filled out.
 * Any omitted values will be fetched from the default options
 *
 * @see defaultOptions
 * @param {Object} options
 * @returns {Object}
 */
function mergeDefaults(options: NumberScaleOptions) {
  let i;
  let iLen;

  options = options || {};

  for (i = 0, iLen = defaultOptionsKeys.length; i < iLen; ++i) {
    if (!(defaultOptionsKeys[i] in options)) {
      options[defaultOptionsKeys[i]] = defaultOptions[defaultOptionsKeys[i]];
    }
  }

  return options;
}

/**
 * Make sure str does not contain any regex expressions
 *
 * @function escapeRegexp
 * @private
 * @param {string} str
 * @returns {string}
 */
function escapeRegexp(str: string) {
  return str.replace(/([.*+?=^!:${}()|[\]\/\\])/g, '\\$1');
}

/**
 * Round the given value, considering it as a negative, or positive one.
 *
 * The function will round to the next 'even', or 'odd' number, or will round
 * 'down', or 'up' to any next integer. For any other value, a default mathematical
 * rounding will be performed (i.e. round to the nearest integer, half up)
 *
 * @function round
 * @private
 * @param {string} mode    one of 'even', 'odd', 'up', 'down', or any other value
 * @param {boolean} neg    if the value should considered as negative
 * @param {Number} value   a value to round (i.e. with decimals)
 * @returns {Number}       the value rounded
 */
function round(mode: string, neg: boolean, value: number): number {
  let i = value | 0;

  if (neg) {
    i = -i;
    value = -value;
  }

  //console.log("??? ROUND", mode, neg, value, i, i & 1);

  if (mode === 'even') {
    if ((!neg && i > value) || i & 1) {
      // odd
      value = i + 1;
    } else {
      value = i;
    }
  } else if (mode === 'odd') {
    if ((!neg && i > value) || i & 1) {
      // odd
      value = i;
    } else {
      value = i + 1;
    }
  } else if (mode === 'up') {
    value = Math.ceil(value);
  } else if (mode === 'down') {
    value = Math.floor(value);
  } else {
    value = Math.round(value);
  }

  return neg ? Math.abs(value) : value;
}

/**
 * Make sure a decimal value contains the specified precision.
 * Ignore any integer value.
 *
 * @function formatPrecision
 * @private
 * @param {Number} value
 * @param {Number} precision
 * @returns {string}
 */
function formatPrecision(value: number, precision: number): string {
  const i = value | 0;

  if (i !== value && Math.max(precision, 0)) {
    return Number(value).toFixed(precision);
  } else {
    return String(value);
  }
}

/**
 * Build a scale and prepare it to be used by the formatter and parser
 *
 * @function buildScale
 * @private
 * @param {Object} prefixes       a key-value object which keys are scale units and values it's base value
 * @param {Number} baseUnitValue  the base value, or scale pivot point
 * @return {Object}
 */
function buildScale(prefixes: ScalePrefixDefinition, baseUnitValue: number): Scale {
  const list: ScaleUnit[] = []; // Lists prefixes and their factor in ascending order.
  const map = {}; // Maps from prefixes to their factor.
  let unitBase: number | string = ''; // the base unit for this scale
  let unitTmpValue = Number.MAX_VALUE;
  const tmp: string[] = [];

  baseUnitValue = baseUnitValue || 0;

  Object.keys(prefixes).forEach(function (prefix) {
    const name = prefix;
    const value = prefixes[prefix];

    list.push([name, value]);

    map[name] = value;

    tmp.push(escapeRegexp(name));

    if (Math.abs(baseUnitValue - value) < Math.abs(baseUnitValue - unitTmpValue)) {
      unitBase = name;
      unitTmpValue = value;
    }
  });

  list.sort(function (a, b) {
    return a[1] - b[1];
  });

  const sortedTmp: string = tmp
    .sort(function (a, b) {
      return b.length - a.length; // Matches longest first.
    })
    .join('|');
  const re = new RegExp('^\\s*((?:-)?\\d+(?:\\.\\d+)?)\\s*(' + sortedTmp + ').*?$', 'i');

  return {
    list: list,
    map: map,
    re: re,
    base: unitBase,
  };
}

/**
 * Binary search to find the greatest index which has a value <=.
 *
 * @function findPrefix
 * @private
 * @param {Array} list      the scale's units list
 * @param {Number} value    a numeric value
 * @returns {Array}         the found list item
 */
function findPrefix(list: any[], value: number): any[] {
  /* jshint bitwise: false */

  let low = 0;
  let high = list.length - 1;

  let mid, current;
  while (low !== high) {
    mid = (low + high + 1) >> 1;
    current = list[mid][1];

    if (current > value) {
      high = mid - 1;
    } else {
      low = mid;
    }
  }

  return list[low];
}

/**
 * Format the given value according to a scale and return it
 *
 * @function _numberScale
 * @see defaultOptions
 * @param {Number} num         the number to format to scale
 * @param {Object} options     the options
 * @returns {string}           the scaled number
 */
function _numberScale(num: number, options: NumberScaleOptions): string | string[] {
  let value;
  let remainder;

  options = mergeDefaults(options);

  // Ensures `value` is a number (or NaN).
  value = Number(num);
  const scale = knownScales[options.scale];

  // If `value` is 0 or NaN.
  if (!value) {
    return `0${scale.base}${(options.unit && ' ' + options.unit) || options.unit}`;
  }

  const neg = value < 0;
  value = Math.abs(value);

  const prefix: number[] = findPrefix(scale.list, value);
  const roundModifier = +`1e${Math.max(options.precision, 0)}`;

  value = round(options.roundMode as string, neg, (value * roundModifier) / prefix[1]) / roundModifier;

  if (options.recursive) {
    --options.recursive;

    value = value | 0;
    remainder = Math.abs(num) - value * prefix[1];

    value = String(value);
  } else {
    value = formatPrecision(value, options.precision);
  }

  if (neg) {
    if (value !== '0') {
      value = '-' + value;
    }
    remainder = (remainder && -remainder) || 0;
  }
  const formattedUnit = `${prefix[0]}${options.unit}`;

  value = `${value}${formattedUnit ? ' ' : ''}${formattedUnit}`;

  if (remainder && prefix !== scale.list[0]) {
    remainder = _numberScale(remainder, options);

    if (Array.isArray(remainder)) {
      value = [value].concat(remainder);
    } else {
      value = [value, remainder];
    }
  }

  return value;
}

/**
 * Parse this value and return a number, or NaN if value is invalid
 *
 * @function parseScale
 * @see defaultOptions
 * @param {(Array|Number)} value     a value as returned by _numberScale()
 * @param {Object} options           the options. Same as _numberScale()'s options
 * @return {(Number|NaN)}            the parsed value as a number
 */
function parseScale(value: string | string[], options: NumberScaleOptions): number {
  let returnedValue: number;

  if (Array.isArray(value)) {
    return value.reduce(function (prev, val) {
      return prev + parseScale(val, options);
    }, 0);
  }

  options = mergeDefaults(options);

  const scale = knownScales[options.scale];

  const matches = scale.re.exec(`${value}`);

  if (matches) {
    if (!matches[2]) {
      matches[2] = `${scale.base}`;
    }

    returnedValue = (matches as any)[1] * scale.map[matches[2]];
  } else {
    returnedValue = NaN;
  }

  return returnedValue;
}

/**
 * Define and bind a new scale, or override an existing one
 *
 * @function defineScale
 * @param {string} name          the scale name
 * @param {Object} prefixes      the prefixes definitions
 * @param {Number} baseUnitValue the base value, or scale pivot point
 */
function defineScale(name: string, prefixes: ScalePrefixDefinition, baseUnitValue: number) {
  knownScales[name] = buildScale(prefixes, baseUnitValue);
  numberScale.scales[name] = knownScales[name];
}

// Scale Aliasses
knownScales['IEEE-1541'] = knownScales.IEEE1541;

export type NumberScaleProtoype = (num: number, options: NumberScaleOptions) => string | string[];
export interface NumberScale extends NumberScaleProtoype {
  scales: Record<string, Scale>;
  defineScale: typeof defineScale;
  parse: typeof parseScale;
}

/**
 * expose (readonly) API
 *
 * @namespace _numberScale
 * @borrows defineScale as defineScale
 * @borrows parseScale as scale
 *
 * @property {Object} options.default     default options
 * @property {Object} scales              all known scales
 * @property {Function} defineScale
 * @property {Function} parse
 */
export const numberScale: NumberScale = Object.defineProperties(_numberScale, {
  options: {
    configurable: false,
    enumerable: true,
    writable: false,
    value: {
      default: defaultOptions,
    },
  },
  scales: {
    configurable: false,
    enumerable: true,
    writable: false,
    value: Object.keys(knownScales).reduce(function (scales, scale) {
      scales[scale] = scale;
      return scales;
    }, {}),
  },
  defineScale: {
    configurable: false,
    enumerable: true,
    writable: false,
    value: defineScale,
  },
  parse: {
    configurable: false,
    enumerable: true,
    writable: false,
    value: parseScale,
  },
});
