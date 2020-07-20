export interface NumberScaleOptions {
  precision: number,
  roundMode: 'even' | 'odd' | 'up' | 'down',
  scale: string,
  unit: string,
  recursive: number
}

export interface ScaleDefinitions {
  [scaleKey: string]: Scale;
}

export interface Scale {
  list: ScaleUnit[];
  map: {
    [unit: string]: number
  };
  re: RegExp;
  base: number | string;
}

export type ScaleUnit = [string, number]

export interface ScalePrefixDefinition {
  [unit: string]: number;
}


