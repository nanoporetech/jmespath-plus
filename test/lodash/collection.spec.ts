import { search } from '../../src';

describe('LODASH EXTENSIONS (COLLECTION)', () => {
  it('handles `_countBy` JMESPath function extension', () => {
    const array = ['one', 'two', 'three'];
    expect(search(array, "_countBy(@, 'length')")).toStrictEqual({ '3': 2, '5': 1 });
  });

  it('handles `_every` JMESPath function extension', () => {
    const array = [true, 1, null, 'yes'];
    const users = [
      { user: 'barney', age: 36, active: false },
      { user: 'fred', age: 40, active: false },
    ];
    expect(search(array, '_every(@, `true`)')).toStrictEqual(false);
    expect(search(users, "_every(@, { user: 'barney', active: `false` })")).toStrictEqual(false);
    expect(search(users, "_every(@, ['active', `false`])")).toStrictEqual(true);
    expect(search(users, "_every(@, 'active')")).toStrictEqual(false);
  });

  it('handles `_filter` JMESPath function extension', () => {
    const users = [
      { user: 'barney', age: 36, active: true },
      { user: 'fred', age: 40, active: false },
    ];
    expect(search(users, '_filter(@, { age: `36`, active: `true` })')).toStrictEqual([
      {
        user: 'barney',
        age: 36,
        active: true,
      },
    ]);
    expect(search(users, "_filter(@, ['active', `false`])")).toStrictEqual([{ user: 'fred', age: 40, active: false }]);
    expect(search(users, "_filter(@, 'active')")).toStrictEqual([
      {
        user: 'barney',
        age: 36,
        active: true,
      },
    ]);
  });

  it('handles `_find` JMESPath function extension', () => {
    const users = [
      { user: 'barney', age: 36, active: true },
      { user: 'fred', age: 40, active: false },
      { user: 'pebbles', age: 1, active: true },
    ];
    expect(search(users, '_find(@, { age: `1`, active: `true` })')).toStrictEqual({
      user: 'pebbles',
      age: 1,
      active: true,
    });
    expect(search(users, "_find(@, as_lambda('x => x.age < 40'))")).toStrictEqual({
      user: 'barney',
      age: 36,
      active: true,
    });
    expect(search(users, "_find(@, ['active', `false`])")).toStrictEqual({ user: 'fred', age: 40, active: false });
    expect(search(users, "_find(@, 'active')")).toStrictEqual({
      user: 'barney',
      age: 36,
      active: true,
    });
  });

  it('handles `_findLast` JMESPath function extension', () => {
    const users = [
      { user: 'barney', age: 36, active: true },
      { user: 'fred', age: 40, active: false },
      { user: 'pebbles', age: 1, active: true },
    ];
    expect(search(users, '_findLast(@, { age: `1`, active: `true` })')).toStrictEqual({
      user: 'pebbles',
      age: 1,
      active: true,
    });
    expect(search(users, "_findLast(@, ['active', `false`])")).toStrictEqual({ user: 'fred', age: 40, active: false });
    expect(search(users, "_findLast(@, 'active')")).toStrictEqual({
      user: 'pebbles',
      age: 1,
      active: true,
    });
  });

  it('handles `_flatMap` JMESPath function extension', () => {
    expect(search([1, 2], "_flatMap(@, as_lambda('x => [x, x]'))")).toStrictEqual([1, 1, 2, 2]);
  });

  it('handles `_flatMapDeep` JMESPath function extension', () => {
    expect(search([1, 2], "_flatMapDeep(@, as_lambda('x => [[[x, x]]]'))")).toStrictEqual([1, 1, 2, 2]);
  });

  it('handles `_forEach` JMESPath function extension', () => {
    expect(search([1, 2], "_forEach(@, as_lambda('x => x+2'))")).toStrictEqual([1, 2]);
  });

  it('handles `_groupBy` JMESPath function extension', () => {
    expect(search([6.1, 4.2, 6.3], "_groupBy(@, as_lambda('Math.floor'))")).toStrictEqual({
      '4': [4.2],
      '6': [6.1, 6.3],
    });
    expect(search(['one', 'two', 'three'], "_groupBy(@, 'length')")).toStrictEqual({
      '3': ['one', 'two'],
      '5': ['three'],
    });
  });

  it('handles `_includes` JMESPath function extension', () => {
    expect(search([1, 2, 3], '_includes(@, `1`)')).toStrictEqual(true);
    expect(search([1, 2, 3], '_includes(@, `1`, `2`)')).toStrictEqual(false);
    expect(search({ a: 1, b: 2 }, '_includes(@, `1`)')).toStrictEqual(true);
    expect(search('abcd', "_includes(@, 'bc')")).toStrictEqual(true);
  });

  it('handles `_invokeMap` JMESPath function extension', () => {
    expect(
      search(
        [
          [5, 1, 7],
          [3, 2, 1],
        ],
        "_invokeMap(@, 'sort')",
      ),
    ).toStrictEqual([
      [1, 5, 7],
      [1, 2, 3],
    ]);
  });

  it('handles `_keyBy` JMESPath function extension', () => {
    const array = [
      { dir: 'left', code: 97 },
      { dir: 'right', code: 100 },
    ];
    expect(search(array, "_keyBy(@, as_lambda('x => String.fromCharCode(x.code)'))")).toStrictEqual({
      a: { dir: 'left', code: 97 },
      d: { dir: 'right', code: 100 },
    });
    expect(search(array, "_keyBy(@, 'dir')")).toStrictEqual({
      left: { dir: 'left', code: 97 },
      right: { dir: 'right', code: 100 },
    });
  });

  it('handles `_map` JMESPath function extension', () => {
    expect(search([4, 8], "_map(@, as_lambda('n => n * n'))")).toStrictEqual([16, 64]);
    expect(search({ a: 4, b: 8 }, "_map(@, as_lambda('n => n * n'))")).toStrictEqual([16, 64]);
    expect(search([{ user: 'barney' }, { user: 'fred' }], "_map(@, 'user')")).toStrictEqual(['barney', 'fred']);
  });

  it('handles `_orderBy` JMESPath function extension', () => {
    const users = [
      { user: 'fred', age: 48 },
      { user: 'barney', age: 34 },
      { user: 'fred', age: 40 },
      { user: 'barney', age: 36 },
    ];
    expect(search(users, "_orderBy(@, ['user', 'age'], ['asc', 'desc'] )")).toStrictEqual([
      { user: 'barney', age: 36 },
      { user: 'barney', age: 34 },
      { user: 'fred', age: 48 },
      { user: 'fred', age: 40 },
    ]);
  });

  it('handles `_partition` JMESPath function extension', () => {
    const users = [
      { user: 'barney', age: 36, active: false },
      { user: 'fred', age: 40, active: true },
      { user: 'pebbles', age: 1, active: false },
    ];
    expect(search(users, "_partition(@, as_lambda('o => o.active'))")).toStrictEqual([
      [{ user: 'fred', age: 40, active: true }],
      [
        { user: 'barney', age: 36, active: false },
        { user: 'pebbles', age: 1, active: false },
      ],
    ]);
    expect(search(users, '_partition(@, { age: `1`, active: `false` })')).toStrictEqual([
      [{ user: 'pebbles', age: 1, active: false }],
      [
        { user: 'barney', age: 36, active: false },
        { user: 'fred', age: 40, active: true },
      ],
    ]);
    expect(search(users, "_partition(@, ['active', `false`])")).toStrictEqual([
      [
        { user: 'barney', age: 36, active: false },
        { user: 'pebbles', age: 1, active: false },
      ],
      [{ user: 'fred', age: 40, active: true }],
    ]);
    expect(search(users, "_partition(@, 'active')")).toStrictEqual([
      [{ user: 'fred', age: 40, active: true }],
      [
        { user: 'barney', age: 36, active: false },
        { user: 'pebbles', age: 1, active: false },
      ],
    ]);
  });

  it('handles `_reduce` JMESPath function extension', () => {
    const obj = { a: 1, b: 2, c: 1 };
    expect(
      search(obj, "_reduce(@, as_lambda('(r, v, k) => {(r[v] || (r[v] = [])).push(k);return r;}'), `{}` )"),
    ).toStrictEqual({ '1': ['a', 'c'], '2': ['b'] });
  });

  it('handles `_reduceRight` JMESPath function extension', () => {
    const array = [
      [0, 1],
      [2, 3],
      [4, 5],
    ];
    expect(
      search(array, "_reduceRight(@, as_lambda('(flattened, other) => [...flattened, ...other]'), `[]` )"),
    ).toStrictEqual([4, 5, 2, 3, 0, 1]);
  });

  it('handles `_reject` JMESPath function extension', () => {
    const users = [
      { user: 'barney', age: 36, active: false },
      { user: 'fred', age: 40, active: true },
    ];

    expect(search(users, "_reject(@, as_lambda('o => !o.active'))")).toStrictEqual([
      { user: 'fred', age: 40, active: true },
    ]);
    expect(search(users, '_reject(@, { age: `40`, active: `true` })')).toStrictEqual([
      { user: 'barney', age: 36, active: false },
    ]);
    expect(search(users, "_reject(@, ['active', `false`])")).toStrictEqual([{ user: 'fred', age: 40, active: true }]);
    expect(search(users, "_reject(@, 'active')")).toStrictEqual([{ user: 'barney', age: 36, active: false }]);
  });

  it('handles `_sample` JMESPath function extension', () => {
    const result = search([1, 2, 3, 4], '_sample(@)') as number;
    expect([1, 2, 3, 4].includes(result)).toStrictEqual(true);
  });

  it('handles `_sampleSize` JMESPath function extension', () => {
    let result = search([1, 2, 3], '_sampleSize(@, `2`)') as number[];
    expect(result.length).toStrictEqual(2);
    expect(result.every(x => [1, 2, 3].includes(+x))).toStrictEqual(true);
    result = search([1, 2, 3], '_sampleSize(@, `4`)') as number[];
    expect(result.length).toStrictEqual(3);
    expect(result.every(x => [1, 2, 3].includes(x))).toStrictEqual(true);
  });

  it('handles `_shuffle` JMESPath function extension', () => {
    const result = search([1, 2, 3, 4], '_shuffle(@)') as number[];
    expect(result.length).toStrictEqual(4);
    expect(result.every(x => [1, 2, 3, 4].includes(x))).toStrictEqual(true);
  });

  it('handles `_size` JMESPath function extension', () => {
    expect(search([1, 2, 3], '_size(@)')).toStrictEqual(3);
    expect(search({ a: 1, b: 2 }, '_size(@)')).toStrictEqual(2);
  });

  it('handles `_some` JMESPath function extension', () => {
    expect(search([null, 0, 'yes', false], "_some(@, as_lambda('Boolean'))")).toStrictEqual(true);

    const users = [
      { user: 'barney', active: true },
      { user: 'fred', active: false },
    ];

    expect(search(users, "_some(@, { user: 'barney', active: `false` })")).toStrictEqual(false);
    expect(search(users, "_some(@, ['active', `false`])")).toStrictEqual(true);
    expect(search(users, "_some(@, 'active')")).toStrictEqual(true);
  });

  it('handles `_sortBy` JMESPath function extension', () => {
    const users = [
      { user: 'fred', age: 48 },
      { user: 'barney', age: 36 },
      { user: 'fred', age: 40 },
      { user: 'barney', age: 34 },
    ];

    expect(search(users, "_sortBy(@, as_lambda('o => o.user'))")).toStrictEqual([
      { user: 'barney', age: 36 },
      { user: 'barney', age: 34 },
      { user: 'fred', age: 48 },
      { user: 'fred', age: 40 },
    ]);
    expect(search(users, "_sortBy(@, ['user', 'age'])")).toStrictEqual([
      { user: 'barney', age: 34 },
      { user: 'barney', age: 36 },
      { user: 'fred', age: 40 },
      { user: 'fred', age: 48 },
    ]);
  });
});
