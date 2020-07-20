export type { FunctionSignature, InputSignature, RuntimeFunction } from '@metrichor/jmespath/dist/types';
export * as NumberScale from './types/number-scale.type';
import { jmespath as JMESPath } from '@metrichor/jmespath';

import { loadPlugins } from './plugins';

export const TYPE_ANY = JMESPath.TYPE_ANY;
export const TYPE_ARRAY = JMESPath.TYPE_ARRAY;
export const TYPE_ARRAY_NUMBER = JMESPath.TYPE_ARRAY_NUMBER;
export const TYPE_ARRAY_STRING = JMESPath.TYPE_ARRAY_STRING;
export const TYPE_BOOLEAN = JMESPath.TYPE_BOOLEAN;
export const TYPE_EXPREF = JMESPath.TYPE_EXPREF;
export const TYPE_NULL = JMESPath.TYPE_NULL;
export const TYPE_NUMBER = JMESPath.TYPE_NUMBER;
export const TYPE_OBJECT = JMESPath.TYPE_OBJECT;
export const TYPE_STRING = JMESPath.TYPE_STRING;

export const compile = JMESPath.compile;
export const tokenize = JMESPath.tokenize;
export const registerFunction = JMESPath.registerFunction;
export const search = JMESPath.search;
export const TreeInterpreter = JMESPath.TreeInterpreter;

export const jmespath = loadPlugins() && JMESPath;

export default {
  compile,
  jmespath,
  registerFunction,
  search,
  tokenize,
  TreeInterpreter,
  TYPE_ANY,
  TYPE_ARRAY_NUMBER,
  TYPE_ARRAY_STRING,
  TYPE_ARRAY,
  TYPE_BOOLEAN,
  TYPE_EXPREF,
  TYPE_NULL,
  TYPE_NUMBER,
  TYPE_OBJECT,
  TYPE_STRING,
};
