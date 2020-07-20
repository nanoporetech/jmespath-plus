import {
  registerFunction,
  TYPE_ANY,
  TYPE_ARRAY,
  TYPE_ARRAY_NUMBER,
  TYPE_EXPREF,
  TYPE_NUMBER,
  TYPE_OBJECT,
  TYPE_STRING,
} from '@metrichor/jmespath';
import { ExpressionNodeTree, JSONObject } from '@metrichor/jmespath/dist/types/typings';
import * as _lodash from 'lodash';
import { numberScale } from './utils/number-scale';
import { SUPPORTED_FUNCTIONS } from './supportedFunctions';

export const loadPlugins = (): boolean => {
  registerFunction(
    'mean',
    ([vector]: [number[]]) => {
      return vector.reduce((a, b) => a + b, 0) / vector.length;
    },
    [{ types: [TYPE_ARRAY_NUMBER] }],
  );

  registerFunction(
    'mode',
    ([vector]: [number[]]) => {
      if (!vector.length) return null;
      const modeTracker = vector
        .sort((a: number, b: number) => a - b)
        .reduce((valueCount: { [mode: number]: [number, number] }, newValue: any) => {
          const valueKey = Number.parseFloat(newValue);
          valueCount[valueKey] = valueCount[valueKey]
            ? [valueCount[valueKey][0] + 1, valueCount[valueKey][1]]
            : [1, newValue];
          return valueCount;
        }, {});
      const maxOccurrence = Math.max(...Object.values(modeTracker).map(x => x[0]));
      if (maxOccurrence === 1 && vector.length > 1) {
        return null;
      }
      return Object.values(modeTracker)
        .filter(([occurrence]) => occurrence === maxOccurrence)
        .map(v => v[1]);
    },
    [{ types: [TYPE_ARRAY_NUMBER] }],
  );

  registerFunction(
    'median',
    ([vector]: [number[]]) => {
      if (!vector.length) return null;
      const sorted = vector.sort((a: number, b: number) => a - b);
      const halfway = vector.length / 2;
      if (vector.length % 2 === 0) {
        return (sorted[halfway - 1] + sorted[halfway]) / 2;
      }
      return sorted[Math.floor(halfway)];
    },
    [{ types: [TYPE_ARRAY_NUMBER] }],
  );

  registerFunction(
    'toFixed',
    ([toFormat, precision]) => {
      return `${Number.parseFloat(toFormat || 0.0).toFixed(precision)}`;
    },
    [{ types: [TYPE_NUMBER] }, { types: [TYPE_NUMBER] }],
  );

  registerFunction(
    'formatNumber',
    ([toFormat, precision, unit]) => {
      const formattedNumber = numberScale(toFormat || 0.0, {
        precision,
        recursive: 0,
        scale: 'SI',
        unit: unit || '',
      });
      const hasMatch = /[\d\.]+/g.exec(formattedNumber);
      const hasOne = hasMatch && hasMatch[0] === '1';
      return `${formattedNumber}${unit && (hasOne ? '' : 's')}`;
    },
    [{ types: [TYPE_NUMBER] }, { types: [TYPE_NUMBER] }, { types: [TYPE_STRING] }],
  );

  registerFunction(
    'uniq',
    ([resolvedArgs]) => {
      return Array.from(new Set<any>(resolvedArgs));
    },
    [{ types: [TYPE_ARRAY] }],
  );

  registerFunction(
    'mod',
    resolvedArgs => {
      const [dividend, divisor] = resolvedArgs;
      return dividend % divisor;
    },
    [{ types: [TYPE_NUMBER] }, { types: [TYPE_NUMBER] }],
  );

  registerFunction(
    'divide',
    resolvedArgs => {
      const [dividend, divisor] = resolvedArgs;
      return dividend / divisor;
    },
    [{ types: [TYPE_NUMBER] }, { types: [TYPE_NUMBER] }],
  );

  registerFunction(
    'split',
    ([splitChar, toSplit]) => {
      return toSplit.split(splitChar);
    },
    [{ types: [TYPE_STRING] }, { types: [TYPE_STRING] }],
  );

  registerFunction(
    'entries',
    ([resolvedArgs]) => {
      return Object.entries(resolvedArgs);
    },
    [{ types: [TYPE_OBJECT, TYPE_ARRAY] }],
  );

  registerFunction(
    'format',
    ([template, templateStringsMap]) => {
      let newTemplate = template;
      for (const attr in templateStringsMap) {
        const rgx = new RegExp(`\\$\\{${attr}\\}`, 'g');
        newTemplate = newTemplate.replace(rgx, templateStringsMap[attr] ?? '');
      }
      return newTemplate;
    },
    [{ types: [TYPE_STRING] }, { types: [TYPE_OBJECT, TYPE_ARRAY] }],
  );

  registerFunction(
    'flatMapValues',
    ([inputObject]) => {
      return Object.entries(inputObject).reduce((flattened, entry) => {
        const [key, value]: [string, any] = entry;

        if (Array.isArray(value)) {
          return [...flattened, ...value.map(v => [key, v])];
        }
        return [...flattened, [key, value]];
      }, [] as any[]);
    },
    [{ types: [TYPE_OBJECT, TYPE_ARRAY] }],
  );

  registerFunction(
    'toUpperCase',
    ([inputString]: [string]) => {
      return inputString.toLocaleUpperCase();
    },
    [{ types: [TYPE_STRING] }],
  );

  registerFunction(
    'toLowerCase',
    ([inputString]: [string]) => {
      return inputString.toLocaleLowerCase();
    },
    [{ types: [TYPE_STRING] }],
  );

  registerFunction(
    'trim',
    ([inputString]: [string]) => {
      return inputString.trim();
    },
    [{ types: [TYPE_STRING] }],
  );

  registerFunction(
    'groupBy',
    function (this: any, [memberList, exprefNode]: [JSONObject[], ExpressionNodeTree | string]) {
      if (!this._interpreter) return {};

      if (typeof exprefNode === 'string') {
        return memberList.reduce((grouped, member) => {
          if (exprefNode in member) {
            const key = member[exprefNode] as string;
            const currentMembers = (grouped[key] as any[]) || [];
            grouped[key] = [...currentMembers, member];
          }
          return grouped;
        }, {});
      }
      const interpreter = this._interpreter;
      const requiredType = Array.from(new Set(memberList.map(member => this.getTypeName(member))));
      const onlyObjects = requiredType.every(x => x === TYPE_OBJECT);
      if (!onlyObjects) {
        throw new Error(
          `TypeError: unexpected type. Expected Array<object> but received Array<${requiredType
            .map(type => this.TYPE_NAME_TABLE[type])
            .join(' | ')}>`,
        );
      }

      return memberList.reduce((grouped, member) => {
        const key = interpreter.visit(exprefNode, member) as string;
        const currentMembers = (grouped[key] as any[]) || [];
        grouped[key] = [...currentMembers, member];
        return grouped;
      }, {});
    },
    [{ types: [TYPE_ARRAY] }, { types: [TYPE_EXPREF, TYPE_STRING] }],
  );

  registerFunction(
    'combine',
    ([resolvedArgs]: [JSONObject[]]) => {
      let merged = {};
      for (let i = 0; i < resolvedArgs.length; i += 1) {
        const current = resolvedArgs[i];
        merged = Array.isArray(current) ? Object.assign(merged, ...current) : Object.assign(merged, current);
      }
      return merged;
    },
    [
      {
        types: [TYPE_OBJECT, TYPE_ARRAY],
        variadic: true,
      },
    ],
  );

  for (const key of SUPPORTED_FUNCTIONS) {
    registerFunction(
      `_${key}`,
      (resolvedArgs: any) => {
        return resolvedArgs.length > 1 ? _lodash[key](...resolvedArgs) : _lodash[key](resolvedArgs[0]);
      },
      [
        {
          types: [TYPE_ANY],
          variadic: true,
        },
      ],
    );
  }
  return true;
};
