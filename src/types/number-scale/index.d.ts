// number-scale/index.d.ts

export as namespace numberScaleLib;

/*~ This declaration specifies that the function
 *~ is the exported object from the file
 */

/*~ This example shows how to have multiple overloads for your function */
declare function NumberScale(data: number, options: NumberScale.NumberScaleOptions): string;
// declare function NumberScale(length: number): NumberScale.LengthReturnType;

/*~ If you want to expose types from your module as well, you can
 *~ place them in this block. Often you will want to describe the
 *~ shape of the return type of the function; that type should
 *~ be declared in here, as this example shows.
 *~
 *~ Note that if you decide to include this namespace, the module can be
 *~ incorrectly imported as a namespace object, unless
 *~ --esModuleInterop is turned on:
 *~   import * as x from '[~THE MODULE~]'; // WRONG! DO NOT DO THIS!
 */
declare namespace NumberScale {
  export interface ScaleDefinition {
    [unit: string]: number;
  }

  export interface NumberScaleOptions {
    scale: string;
    precision: number;
    recursive: number;
    unit: string;
    // [unit: string]: number
  }

  /*~ If the module also has properties, declare them here. For example,
   *~ this declaration says that this code is legal:
   *~   import f = require('numberScaleLibrary');
   *~   console.log(f.defaultName);
   */
  export function defineScale(name: string, scale: IScale, base: number): void;
}

declare module 'number-scale' {
  export = NumberScale;
}
