import { search } from '@metrichor/jmespath';
import { loadPlugins } from '../src/plugins';

describe('NATIVE JMESPATH EXTENSIONS', () => {
  it('should augment jmespath std lib', () => {
    expect(() => search('Foo-bar_fez-baz', 'split(`-`, @)')).toThrow('Unknown function: split()');
    loadPlugins();
    expect(() => search('Foo-bar_fez-baz', 'split(`-`, @)')).not.toThrow();
    expect(search('Foo-bar_fez-baz', 'split(`-`, @)')).toStrictEqual(['Foo', 'bar_fez', 'baz']);
  });

  it('applies the `mode` function', () => {
    // Calculate the most common value

    let returnValue = search([-1, 2.21, -3.2, 4.2, 5.2, 2.21, 3.3, 4.11, 1.33, 5.1, 2.21, 3.2, 1.11, 5.67], 'mode(@)');
    expect(returnValue).toStrictEqual([2.21]);
    returnValue = search([], 'mode(@)');
    expect(returnValue).toStrictEqual(null);
    returnValue = search([1, 2, 3], 'mode(@)');
    expect(returnValue).toStrictEqual(null);
    returnValue = search([8, 9, 10, 10, 10, 11, 11, 11, 12, 13], 'mode(@)');
    expect(returnValue).toStrictEqual([10, 11]);
  });

  it('applies the `as_lambda` function', () => {
    // Calculate the most common value

    const returnValue = search(
      [-1, 2.21, -3.2, 4.2, 5.2, 2.21, 3.3, 4.11, 1.33, 5.1, 2.21, 3.2, 1.11, 5.67],
      "_flatMap(@, as_lambda('x => Math.floor(x)'))",
    );
    expect(returnValue).toStrictEqual([-1, 2, -4, 4, 5, 2, 3, 4, 1, 5, 2, 3, 1, 5]);
  });

  it('applies the `as_regexp` function', () => {
    let regexp = search('abc', 'as_regexp(@)') as unknown;
    expect(regexp).toBeInstanceOf(RegExp);
    expect((regexp as RegExp).test('abcde')).toStrictEqual(true);
    expect((regexp as RegExp).test('ABCde')).toStrictEqual(false);
    regexp = search('abc', "as_regexp(@, 'i')");
    expect((regexp as RegExp).test('ABCde')).toStrictEqual(true);

    expect(() => search('(\\{{]+?}}', 'as_regexp(@)')).toThrow(
      'Invalid regular expression: /(\\{{]+?}}/: Unterminated group',
    );
  });

  it('applies the `median` function', () => {
    // Calculate the most common value
    let returnValue = search(
      [-1, 2.21, -3.2, 4.2, 5.2, 2.21, 3.3, 4.11, 1.33, 5.1, 2.21, 3.2, 1.11, 5.67],
      'median(@)',
    );
    expect(returnValue).toStrictEqual(2.705);
    returnValue = search([], 'median(@)');
    expect(returnValue).toStrictEqual(null);
    returnValue = search([2, 1, 3], 'median(@)');
    expect(returnValue).toStrictEqual(2);
    returnValue = search([4, 2, 1, 3], 'median(@)');
    expect(returnValue).toStrictEqual(2.5);
    returnValue = search([8, 9, 10, 10, 10, 11, 11, 11, 12, 13], 'median(@)');
    expect(returnValue).toStrictEqual(10.5);
  });

  it('applies the `mod` function', () => {
    // Calculate the modulus of two numbers
    let returnValue = search([27, 2], 'mod([0], [1])');
    expect(returnValue).toStrictEqual(1);
    returnValue = search([26, 2], 'mod([0], [1])');
    expect(returnValue).toStrictEqual(0);
  });

  it('applies the `divide` function', () => {
    // Calculate the division of two numbers
    let returnValue = search([27, 2], 'divide([0], [1])');
    expect(returnValue).toStrictEqual(13.5);
    returnValue = search([26, 2], 'divide([0], [1])');
    expect(returnValue).toStrictEqual(13);
  });

  it('applies the `split` function', () => {
    // Calculate the division of two numbers
    const returnValue = search('Foo-bar_fez-baz', 'split(`-`, @)');
    expect(returnValue).toStrictEqual(['Foo', 'bar_fez', 'baz']);
  });

  it('applies the `format` function', () => {
    // Calculate the division of two numbers
    let returnValue = search(['Mr', 'zebra'], 'format(`Hello ${100} ${animal}`, @)');
    expect(returnValue).toStrictEqual('Hello ${100} ${animal}');
    returnValue = search(['Mr', 'zebra'], 'format(`Hello ${0} ${1}`, @)');
    expect(returnValue).toStrictEqual('Hello Mr zebra');
    returnValue = search({ title: 'Mr', animal: 'zebra' }, 'format(`Hello ${title} ${animal}`, @)');
    expect(returnValue).toStrictEqual('Hello Mr zebra');
    returnValue = search({ title: null, animal: 'zebra' }, 'format(`Hello ${title} ${animal}`, @)');
    expect(returnValue).toStrictEqual('Hello  zebra');
  });

  it('applies the `entries` function', () => {
    // Calculate the division of two numbers
    const returnValue = search(
      {
        category_1: [{ count: 10, name: 'medium' }],
        category_2: [{ count: 40, name: 'high' }],
      },
      'entries(@)',
    );
    expect(returnValue).toStrictEqual([
      ['category_1', [{ count: 10, name: 'medium' }]],
      ['category_2', [{ count: 40, name: 'high' }]],
    ]);
  });

  it('applies the `mean` function', () => {
    // Load when there's nothing but ID given
    const returnValue = search([13, 18, 13, 14, 13, 16, 14, 21, 13], 'mean(@)');
    expect(returnValue).toStrictEqual(15);
  });

  it('applies the `uniq` function', () => {
    // Calculate the most common value
    let returnValue = search([1, 2, 4, 3, 2, 3, 4, 1, 2, 3, 2, 3, 3, 4, 2, 1], 'uniq(@)');
    expect(returnValue).toStrictEqual([1, 2, 4, 3]);

    returnValue = search(
      [
        'label-2',
        'label-4',
        'label-3',
        'label-2',
        'label-3',
        'label-4',
        'label-1',
        'label-2',
        'label-3',
        'label-2',
        'label-3',
        'label-3',
        'label-4',
        'label-2',
        'label-1',
      ],
      'uniq(@)',
    );
    expect(returnValue).toStrictEqual(['label-2', 'label-4', 'label-3', 'label-1']);
  });

  it('applies the `formatNumber` function', () => {
    // Load when there's nothing but ID given
    let returnValue = search(123456789.123456789, 'formatNumber(@, `2`, `base`)');
    expect(returnValue).toStrictEqual('123.46 Mbases');
    returnValue = search(123456789.123456789, 'formatNumber(@, `1`, `base`)');
    expect(returnValue).toStrictEqual('123.5 Mbases');
    returnValue = search(123456789.123456789, 'formatNumber(@, `1`, ``)');
    expect(returnValue).toStrictEqual('123.5 M');
    returnValue = search(123.45, 'formatNumber(@, `1`, ``)');
    expect(returnValue).toStrictEqual('123.5');
    returnValue = search(123.45, 'formatNumber(@, `1`, `base`)');
    expect(returnValue).toStrictEqual('123.5 bases');
    returnValue = search(123456789.123456789, 'formatNumber(@, `0`, `base`)');
    expect(returnValue).toStrictEqual('124 Mbases');
    returnValue = search(0, 'formatNumber(@, `2`, ``)');
    expect(returnValue).toStrictEqual('0');
    returnValue = search(NaN, 'formatNumber(@, `2`, ``)');
    expect(returnValue).toStrictEqual('0');
    returnValue = search(0, 'formatNumber(@, `2`, `foo`)');
    expect(returnValue).toStrictEqual('0 foos');
    returnValue = search(NaN, 'formatNumber(@, `2`, `foo`)');
    expect(returnValue).toStrictEqual('0 foos');

    // Test singular
    returnValue = search(1000.1, 'formatNumber(@, `1`, `base`)');
    expect(returnValue).toStrictEqual('1.1 kbases');
    returnValue = search(1000.1, 'formatNumber(@, `0`, `base`)');
    expect(returnValue).toStrictEqual('2 kbases');
    returnValue = search(1000.0, 'formatNumber(@, `0`, `base`)');
    expect(returnValue).toStrictEqual('1 kbase');
    returnValue = search(1001, 'formatNumber(@, `1`, `base`)');
    expect(returnValue).toStrictEqual('1.1 kbases');
    returnValue = search(1e6, 'formatNumber(@, `0`, `base`)');
    expect(returnValue).toStrictEqual('1 Mbase');
  });

  it('applies the `toFixed` function', () => {
    // Load when there's nothing but ID given
    let returnValue = search(123.45678, 'toFixed(@, `2`)');
    expect(returnValue).toStrictEqual('123.46');
    returnValue = search(0, 'toFixed(@, `2`)');
    expect(returnValue).toStrictEqual('0.00');
  });

  it('handles `flatMapValues` JMESPath function extension', () => {
    // Calculate the most common value
    let returnValue = search({ a: [1, 3, 5], b: [2, 4, 6] }, 'flatMapValues(@)');
    expect(returnValue).toStrictEqual([
      ['a', 1],
      ['a', 3],
      ['a', 5],
      ['b', 2],
      ['b', 4],
      ['b', 6],
    ]);

    returnValue = search(
      {
        a: [true, { x: 3 }, null, 1234, ['XXX']],
        b: { x: 2 },
      },
      'flatMapValues(@)',
    );
    expect(returnValue).toStrictEqual([
      ['a', true],
      ['a', { x: 3 }],
      ['a', null],
      ['a', 1234],
      ['a', ['XXX']],
      ['b', { x: 2 }],
    ]);

    returnValue = search(
      [
        [1, 3, 5],
        [2, 4, 6],
      ],
      'flatMapValues(@)',
    );
    expect(returnValue).toStrictEqual([
      ['0', 1],
      ['0', 3],
      ['0', 5],
      ['1', 2],
      ['1', 4],
      ['1', 6],
    ]);
  });

  it('handles `toUpperCase` JMESPath function extension', () => {
    // Calculate the most common value
    const returnValue = search(`Foo bar`, 'toUpperCase(@)');
    expect(returnValue).toStrictEqual('FOO BAR');
  });

  it('handles `toLowerCase` JMESPath function extension', () => {
    // Calculate the most common value
    const returnValue = search(`Foo bar`, 'toLowerCase(@)');
    expect(returnValue).toStrictEqual('foo bar');
  });

  it('handles `trim` JMESPath function extension', () => {
    // Calculate the most common value
    const returnValue = search(`\n  Foo bar \r`, 'trim(@)');
    expect(returnValue).toStrictEqual('Foo bar');
  });

  it('handles `groupBy` JMESPath function extension', () => {
    let returnValue = search(
      [
        { a: 1, b: 2 },
        { a: 1, b: 3 },
        { a: 2, b: 2 },
        { a: null, b: 999 },
      ],
      'groupBy(@, `a`)',
    );
    expect(returnValue).toStrictEqual({
      1: [
        { a: 1, b: 2 },
        { a: 1, b: 3 },
      ],
      2: [{ a: 2, b: 2 }],
      null: [{ a: null, b: 999 }],
    });

    returnValue = search(
      [
        { a: 1, b: 2 },
        { a: 1, b: 3 },
        { a: 2, b: 2 },
        { a: null, b: 999 },
      ],
      'groupBy(@, &a)',
    );
    expect(returnValue).toStrictEqual({
      1: [
        { a: 1, b: 2 },
        { a: 1, b: 3 },
      ],
      2: [{ a: 2, b: 2 }],
      null: [{ a: null, b: 999 }],
    });

    returnValue = search([{ a: 1, b: 2 }, { a: 1, b: 3 }, { b: 4 }, { a: null, b: 999 }], 'groupBy(@, &a)');
    expect(returnValue).toStrictEqual({
      1: [
        { a: 1, b: 2 },
        { a: 1, b: 3 },
      ],
      null: [{ b: 4 }, { a: null, b: 999 }],
    });

    try {
      returnValue = search([{ a: 1, b: 2 }, `{ a: 1, b: 3 }`, { b: 4 }, 1234], 'groupBy(@, &a)');
    } catch (error) {
      expect(error.message).toEqual(
        'TypeError: unexpected type. Expected Array<object> but received Array<object | string | number>',
      );
    }
  });

  it('handles `combine` JMESPath function extension', () => {
    // Calculate the most common value
    const returnValue = search(
      [
        {
          category_1: [
            {
              count: 10,
              name: 'medium',
            },
          ],
        },
        {
          category_2: [
            {
              count: 40,
              name: 'high',
            },
          ],
        },
      ],
      'combine(@)',
    );
    expect(returnValue).toStrictEqual({
      category_1: [{ count: 10, name: 'medium' }],
      category_2: [{ count: 40, name: 'high' }],
    });
  });

  it('handles `toJSON` JMESPath function extension', () => {
    expect(
      search(
        {
          foo: 6,
          bar: 7,
        },
        'toJSON([foo, bar], `null`, `2`)',
      ),
    ).toEqual(`[\n  6,\n  7\n]`);
    expect(
      search(
        {
          foo: 6,
          bar: 7,
        },
        'toJSON([foo, bar])',
      ),
    ).toEqual('[6,7]');
    expect(
      search(
        {
          foo: {
            bar: 1,
          },
          baz: {
            bar: 10,
          },
        },
        'toJSON(@, [`baz`, `bar`], `\\t`)',
      ),
    ).toEqual(`{\n\t"baz": {\n\t\t"bar": 10\n\t}\n}`);
  });

  it('handles `fromJSON` JMESPath function extension', () => {
    expect(search('{"foo": "bar"}', 'fromJSON(@)')).toEqual({ foo: 'bar' });
    expect(search('true', 'fromJSON(@)')).toEqual(true);
    expect(search('"foo"', 'fromJSON(@)')).toEqual('foo');
    expect(search('[1, 5, "false"]', 'fromJSON(@)')).toEqual([1, 5, 'false']);
    expect(search('null', 'fromJSON(@)')).toEqual(null);
  });
});
