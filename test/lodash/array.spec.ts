import { search } from '../../src';

describe('LODASH EXTENSIONS (ARRAY)', () => {
  it('handles `_` JMESPath function extension', () => {
    const returnValue = search(
      [
        [1, 3, 5],
        [2, 4, 6],
      ],
      '@._zip([0], [1])',
    );
    expect(returnValue).toStrictEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
  });

  it('handles `_fromPairs` JMESPath function extension', () => {
    const returnValue = search(
      [
        ['a', 1],
        ['b', 2],
      ],
      '_fromPairs(@)',
    );
    expect(returnValue).toStrictEqual({ a: 1, b: 2 });
  });

  it('handles `_groupBy` JMESPath function extension', () => {
    const returnValue = search(['one', 'two', 'three'], '_groupBy(@, `length`)');
    expect(returnValue).toStrictEqual({
      3: ['one', 'two'],
      5: ['three'],
    });
  });

  it('handles `_maxBy` JMESPath function extension', () => {
    const returnValue = search([{ n: 1 }, { n: 2 }], '_maxBy(@, `n`)');
    expect(returnValue).toStrictEqual({
      n: 2,
    });
  });

  it('handles `_zip` JMESPath function extension', () => {
    const returnValue = search(
      [
        ['a', 'b'],
        [1, 2],
        [true, false],
      ],
      '_zip([0], [1], [2])',
    );
    expect(returnValue).toStrictEqual([
      ['a', 1, true],
      ['b', 2, false],
    ]);
  });

  it('handles `_chunk` JMESPath function extension', () => {
    const returnValue = search(['a', 'b', 'c', 'd'], '_chunk(@, `2`)');
    expect(returnValue).toStrictEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
  });

  it('handles `_compact` JMESPath function extension', () => {
    const returnValue = search([0, 1, false, 2, '', 3], '_compact(@)');
    expect(returnValue).toStrictEqual([1, 2, 3]);
  });

  it('handles `_concat` JMESPath function extension', () => {
    const returnValue = search([1], '_concat(@, `2`, [`3`], [[`4`]], `foo`)');
    expect(returnValue).toStrictEqual([1, 2, 3, [4], 'foo']);
    expect(search([1, 2, 3], '_concat(@)')).toStrictEqual([1, 2, 3]);
  });

  it('handles `_difference` JMESPath function extension', () => {
    const returnValue = search([2, 1], '_difference(@, [`2`, `3`])');
    expect(returnValue).toStrictEqual([1]);
    expect(search([1, 2, 3], '_difference(@)')).toStrictEqual([1, 2, 3]);
  });

  it('handles `_differenceBy` JMESPath function extension', () => {
    const returnValue = search([{ x: 2 }, { x: 1 }], '_differenceBy(@, [{ x: `1` }], `x`)');
    expect(returnValue).toStrictEqual([{ x: 2 }]);
  });

  it('handles `_drop` JMESPath function extension', () => {
    expect(search([1, 2, 3], '_drop(@)')).toStrictEqual([2, 3]);
    expect(search([1, 2, 3], '_drop(@, `2`)')).toStrictEqual([3]);
    expect(search([1, 2, 3], '_drop(@, `5`)')).toStrictEqual([]);
    expect(search([1, 2, 3], '_drop(@, `0`)')).toStrictEqual([1, 2, 3]);
  });

  it('handles `_dropRight` JMESPath function extension', () => {
    expect(search([1, 2, 3], '_dropRight(@)')).toStrictEqual([1, 2]);
    expect(search([1, 2, 3], '_dropRight(@, `2`)')).toStrictEqual([1]);
    expect(search([1, 2, 3], '_dropRight(@, `5`)')).toStrictEqual([]);
    expect(search([1, 2, 3], '_dropRight(@, `0`)')).toStrictEqual([1, 2, 3]);
  });

  it('handles `_dropRightWhile` JMESPath function extension', () => {
    const users = [
      { user: 'barney', active: true },
      { user: 'fred', active: false },
      { user: 'pebbles', active: false },
    ];
    expect(search(users, '_dropRightWhile(@)')).toStrictEqual([]);
    expect(search(users, '_dropRightWhile(@, { user: `pebbles`, active: `false` })')).toStrictEqual([
      { user: 'barney', active: true },
      { user: 'fred', active: false },
    ]);
    expect(search(users, "_dropRightWhile(@, ['active', `false`])")).toStrictEqual([{ user: 'barney', active: true }]);
    expect(search(users, "_dropRightWhile(@, 'active')")).toStrictEqual(users);
  });

  it('handles `_dropWhile` JMESPath function extension', () => {
    const users = [
      { user: 'barney', active: false },
      { user: 'fred', active: false },
      { user: 'pebbles', active: true },
    ];
    expect(search(users, '_dropWhile(@)')).toStrictEqual([]);
    expect(search(users, "_dropWhile(@, { user: 'barney', active: `false` })")).toStrictEqual([
      { user: 'fred', active: false },
      { user: 'pebbles', active: true },
    ]);
    expect(search(users, "_dropWhile(@, ['active', `false`])")).toStrictEqual([{ user: 'pebbles', active: true }]);
    expect(search(users, "_dropWhile(@, 'active')")).toStrictEqual(users);
  });

  it('handles `_fill` JMESPath function extension', () => {
    const array = [1, 2, 3];
    expect(search(array, '_fill(@, `a`)')).toStrictEqual(['a', 'a', 'a']);
    expect(search(array, '_fill(@, `2`)')).toStrictEqual([2, 2, 2]);
    expect(search([4, 6, 8, 10], "_fill(@, '*', `1`, `3`)")).toStrictEqual([4, '*', '*', 10]);
  });

  it('handles `_findIndex` JMESPath function extension', () => {
    const users = [
      { user: 'barney', active: false },
      { user: 'fred', active: false },
      { user: 'pebbles', active: true },
    ];
    expect(search(users, '_findIndex(@)')).toStrictEqual(0);
    expect(search(users, "_findIndex(@, { user: 'fred', active: `false` })")).toStrictEqual(1);
    expect(search(users, "_findIndex(@, ['active', `false`])")).toStrictEqual(0);
    expect(search(users, "_findIndex(@, ['active', `false`], `1`)")).toStrictEqual(1);
    expect(search(users, "_findIndex(@, 'active')")).toStrictEqual(2);
  });

  it('handles `_findLastIndex` JMESPath function extension', () => {
    const users = [
      { user: 'barney', active: true },
      { user: 'fred', active: false },
      { user: 'pebbles', active: false },
    ];
    expect(search(users, '_findLastIndex(@)')).toStrictEqual(2);
    expect(search(users, "_findLastIndex(@, { user: 'barney', active: `true` })")).toStrictEqual(0);
    expect(search(users, "_findLastIndex(@, ['active', `false`])")).toStrictEqual(2);
    expect(search(users, "_findLastIndex(@, ['active', `false`], `1`)")).toStrictEqual(1);
    expect(search(users, "_findLastIndex(@, 'active')")).toStrictEqual(0);
  });

  it('handles `_flatten` JMESPath function extension', () => {
    const array = [1, [2, [3, [4]], 5]];
    expect(search(array, '_flatten(@)')).toStrictEqual([1, 2, [3, [4]], 5]);
  });

  it('handles `_flattenDeep` JMESPath function extension', () => {
    const array = [1, [2, [3, [4]], 5]];
    expect(search(array, '_flattenDeep(@)')).toStrictEqual([1, 2, 3, 4, 5]);
  });

  it('handles `_flattenDepth` JMESPath function extension', () => {
    const array = [1, [2, [3, [4]], 5]];
    expect(search(array, '_flattenDepth(@, `1`)')).toStrictEqual([1, 2, [3, [4]], 5]);
    expect(search(array, '_flattenDepth(@, `2`)')).toStrictEqual([1, 2, 3, [4], 5]);
  });

  it('handles `_fromPairs` JMESPath function extension', () => {
    expect(
      search(
        [
          ['a', 1],
          ['b', 2],
        ],
        '_fromPairs(@)',
      ),
    ).toStrictEqual({ a: 1, b: 2 });
  });

  it('handles `_first` JMESPath function extension', () => {
    expect(search([1, 2, 3], '_first(@)')).toStrictEqual(1);
    expect(search([], '_first(@)')).toStrictEqual(undefined);
  });

  it('handles `_head` JMESPath function extension', () => {
    expect(search([1, 2, 3], '_head(@)')).toStrictEqual(1);
    expect(search([], '_head(@)')).toStrictEqual(undefined);
  });

  it('handles `_indexOf` JMESPath function extension', () => {
    expect(search([1, 2, 1, 2], '_indexOf(@, `2`)')).toStrictEqual(1);
    expect(search([1, 2, 1, 2], '_indexOf(@, `2`, `2`)')).toStrictEqual(3);
  });

  it('handles `_initial` JMESPath function extension', () => {
    expect(search([1, 2, 3], '_initial(@)')).toStrictEqual([1, 2]);
  });

  it('handles `_intersection` JMESPath function extension', () => {
    expect(
      search(
        [
          [2, 1],
          [2, 3],
        ],
        '_intersection([0],[1])',
      ),
    ).toStrictEqual([2]);
  });

  it('handles `_join` JMESPath function extension', () => {
    expect(search([1, 2, 3], "_join(@, '~')")).toStrictEqual('1~2~3');
    expect(search(['a', 'b', 'c'], "_join(@, '~')")).toStrictEqual('a~b~c');
  });

  it('handles `_last` JMESPath function extension', () => {
    expect(search([1, 2, 3], '_last(@)')).toStrictEqual(3);
    expect(search(['a', 'b', 'c'], '_last(@)')).toStrictEqual('c');
  });

  it('handles `_lastIndexOf` JMESPath function extension', () => {
    expect(search([1, 2, 1, 2], '_lastIndexOf(@, `2`)')).toStrictEqual(3);
    expect(search([1, 2, 1, 2], '_lastIndexOf(@, `2`, `2`)')).toStrictEqual(1);
  });

  it('handles `_nth` JMESPath function extension', () => {
    const array = ['a', 'b', 'c', 'd'];
    expect(search(array, '_nth(@, `1`)')).toStrictEqual('b');
    expect(search(array, '_nth(@, `-2`)')).toStrictEqual('c');
  });

  it('handles `_pull` JMESPath function extension', () => {
    const array = ['a', 'b', 'c', 'a', 'b', 'c'];
    expect(search(array, '_pull(@)')).toStrictEqual(array);
    expect(search(array, '_pull(@, `a`, `c`)')).toStrictEqual(['b', 'b']);
  });

  it('handles `_pullAll` JMESPath function extension', () => {
    const array = ['a', 'b', 'c', 'a', 'b', 'c'];
    expect(search(array, '_pullAll(@)')).toStrictEqual(array);
    expect(search(array, '_pullAll(@, [`a`, `c`])')).toStrictEqual(['b', 'b']);
  });

  it('handles `_pullAt` JMESPath function extension', () => {
    const array = ['a', 'b', 'c', 'd'];

    expect(search(array, '_pullAt(@)')).toStrictEqual([]);
    expect(search(array, '_pullAt(@, [`1`, `3`])')).toStrictEqual(['b', 'd']);
    expect(array).toStrictEqual(['a', 'c']);
  });

  it('handles `_reverse` JMESPath function extension', () => {
    expect(search([1, 2, 3], '_reverse(@)')).toStrictEqual([3, 2, 1]);
  });

  it('handles `_remove` JMESPath function extension', () => {
    const array = [1, 2, 3, 4];
    const resultValue = search(array, "_remove(@, as_lambda('n => n % 2 === 0'))");
    expect(array).toStrictEqual([1, 3]);
    expect(resultValue).toStrictEqual([2, 4]);
  });

  it('handles `_slice` JMESPath function extension', () => {
    const array = ['a', 'b', 'c', 'a', 'b', 'c'];
    expect(search(array, '_slice(@, `2`, `5`)')).toStrictEqual(['c', 'a', 'b']);
  });

  it('handles `_sortedIndex` JMESPath function extension', () => {
    const array = [30, 50];
    expect(search(array, '_sortedIndex(@, `40`)')).toStrictEqual(1);
  });

  it('handles `_sortedIndexBy` JMESPath function extension', () => {
    const objects = [{ x: 4 }, { x: 5 }];
    expect(search(objects, "_sortedIndexBy(@, { x: `4` }, 'x')")).toStrictEqual(0);
  });

  it('handles `_sortedIndexOf` JMESPath function extension', () => {
    const array = [4, 5, 5, 5, 6];
    expect(search(array, '_sortedIndexOf(@, `5`)')).toStrictEqual(1);
  });

  it('handles `_sortedLastIndex` JMESPath function extension', () => {
    const array = [4, 5, 5, 5, 6];
    expect(search(array, '_sortedLastIndex(@, `5`)')).toStrictEqual(4);
  });

  it('handles `_sortedLastIndexBy` JMESPath function extension', () => {
    const objects = [{ x: 3 }, { x: 5 }];
    expect(search(objects, "_sortedIndexBy(@, { x: `4` }, 'x')")).toStrictEqual(1);
  });

  it('handles `_sortedLastIndexOf` JMESPath function extension', () => {
    const array = [4, 5, 5, 5, 6];
    expect(search(array, '_sortedLastIndexOf(@, `5`)')).toStrictEqual(3);
  });

  it('handles `_sortedUniq` JMESPath function extension', () => {
    const array = [4, 5, 5, 6];
    expect(search(array, '_sortedUniq(@)')).toStrictEqual([4, 5, 6]);
  });

  it('handles `_tail` JMESPath function extension', () => {
    const array = [1, 2, 3];
    expect(search(array, '_tail(@)')).toStrictEqual([2, 3]);
  });

  it('handles `_take` JMESPath function extension', () => {
    const array = [1, 2, 3];
    expect(search(array, '_take(@)')).toStrictEqual([1]);
    expect(search(array, '_take(@, `2`)')).toStrictEqual([1, 2]);
    expect(search(array, '_take(@, `5`)')).toStrictEqual([1, 2, 3]);
    expect(search(array, '_take(@, `0`)')).toStrictEqual([]);
  });

  it('handles `_takeRight` JMESPath function extension', () => {
    const array = [1, 2, 3];
    expect(search(array, '_takeRight(@)')).toStrictEqual([3]);
    expect(search(array, '_takeRight(@, `2`)')).toStrictEqual([2, 3]);
    expect(search(array, '_takeRight(@, `5`)')).toStrictEqual([1, 2, 3]);
    expect(search(array, '_takeRight(@, `0`)')).toStrictEqual([]);
  });

  it('handles `_takeRightWhile` JMESPath function extension', () => {
    const users = [
      { user: 'barney', active: true },
      { user: 'fred', active: false },
      { user: 'pebbles', active: false },
    ];
    expect(search(users, '_takeRightWhile(@)')).toStrictEqual([
      { active: true, user: 'barney' },
      { active: false, user: 'fred' },
      { active: false, user: 'pebbles' },
    ]);
    expect(search(users, "_takeRightWhile(@, { user: 'pebbles', active: `false` })")).toStrictEqual([
      { user: 'pebbles', active: false },
    ]);
    expect(search(users, "_takeRightWhile(@, ['active', `false`])")).toStrictEqual([
      { active: false, user: 'fred' },
      { active: false, user: 'pebbles' },
    ]);
    expect(search(users, "_takeRightWhile(@, 'active')")).toStrictEqual([]);
  });

  it('handles `_takeWhile` JMESPath function extension', () => {
    const users = [
      { user: 'barney', active: false },
      { user: 'fred', active: false },
      { user: 'pebbles', active: true },
    ];
    expect(search(users, '_takeWhile(@)')).toStrictEqual([
      { active: false, user: 'barney' },
      { active: false, user: 'fred' },
      { active: true, user: 'pebbles' },
    ]);
    expect(search(users, "_takeWhile(@, { user: 'barney', active: `false` })")).toStrictEqual([
      { active: false, user: 'barney' },
    ]);
    expect(search(users, "_takeWhile(@, ['active', `false`])")).toStrictEqual([
      { active: false, user: 'barney' },
      { active: false, user: 'fred' },
    ]);
    expect(search(users, "_takeWhile(@, 'active')")).toStrictEqual([]);
  });

  it('handles `_union` JMESPath function extension', () => {
    const array = [2];
    expect(search(array, '_union(@, [`1`, `2`])')).toStrictEqual([2, 1]);
  });

  it('handles `_uniq` JMESPath function extension', () => {
    const array = [2, 1, 2];
    expect(search(array, '_uniq(@)')).toStrictEqual([2, 1]);
  });

  it('handles `_uniqBy` JMESPath function extension', () => {
    const array = [2, 1, 2];
    expect(search(array, '_uniqBy(@)')).toStrictEqual([2, 1]);
  });

  it('handles `_unzip` JMESPath function extension', () => {
    const array = [
      ['a', 1, true],
      ['b', 2, false],
    ];
    expect(search(array, '_unzip(@)')).toStrictEqual([
      ['a', 'b'],
      [1, 2],
      [true, false],
    ]);
  });

  it('handles `_without` JMESPath function extension', () => {
    const array = [2, 1, 2, 3];
    expect(search(array, '_without(@, `1`, `2`)')).toStrictEqual([3]);
  });

  it('handles `_xor` JMESPath function extension', () => {
    const array = [
      [2, 1],
      [2, 3],
    ];
    expect(search(array, '_xor([0], [1])')).toStrictEqual([1, 3]);
  });

  it('handles `_zip` JMESPath function extension', () => {
    const array = [
      ['a', 'b'],
      [1, 2],
      [true, false],
    ];
    expect(search(array, '_zip([0], [1], [2])')).toStrictEqual([
      ['a', 1, true],
      ['b', 2, false],
    ]);
  });

  it('handles `_zipObject` JMESPath function extension', () => {
    const array = [
      ['a', 'b'],
      [1, 2],
    ];
    expect(search(array, '_zipObject([0], [1])')).toStrictEqual({ a: 1, b: 2 });
  });

  it('handles `_zipObjectDeep` JMESPath function extension', () => {
    const array = [
      ['a.b[0].c', 'a.b[1].d'],
      [1, 2],
    ];
    expect(search(array, '_zipObjectDeep([0], [1])')).toStrictEqual({ a: { b: [{ c: 1 }, { d: 2 }] } });
  });
});
