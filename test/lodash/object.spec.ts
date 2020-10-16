import { search } from '../../src';

describe('LODASH EXTENSIONS (OBJECT)', () => {
  it('handles `_assign` JMESPath function extension', () => {
    expect(search({ a: 1 }, "_assign(@, {b: 'c'})")).toStrictEqual({ a: 1, b: 'c' });
  });

  it('handles `_assignIn` JMESPath function extension', () => {
    expect(search({ a: 1 }, "_assignIn(@, {b: 'c'})")).toStrictEqual({ a: 1, b: 'c' });
  });

  it('handles `_at` JMESPath function extension', () => {
    const object = { a: [{ b: { c: 3 } }, 4] };
    expect(search(object, "_at(@, ['a[0].b.c', 'a[1]'])")).toStrictEqual([3, 4]);
  });

  it('handles `_defaults` JMESPath function extension', () => {
    const array = [{ a: 1 }, { b: 2 }, { a: 3 }];
    expect(search(array, '_defaults([0], [1], [2])')).toStrictEqual({ a: 1, b: 2 });
  });

  it('handles `_defaultsDeep` JMESPath function extension', () => {
    const array = [{ a: { b: 2 } }, { a: { b: 1, c: 3 } }];
    expect(search(array, '_defaultsDeep([0], [1])')).toStrictEqual({ a: { b: 2, c: 3 } });
  });

  it('handles `_findKey` JMESPath function extension', () => {
    const users = {
      barney: { age: 36, active: true },
      fred: { age: 40, active: false },
      pebbles: { age: 1, active: true },
    };
    expect(search(users, "_findKey(@, as_lambda('o => o.age < 40'))")).toStrictEqual('barney');
    expect(search(users, '_findKey(@, { age: `1`, active: `true` })')).toStrictEqual('pebbles');
    expect(search(users, "_findKey(@, ['active', `false` ])")).toStrictEqual('fred');
    expect(search(users, "_findKey(@, 'active')")).toStrictEqual('barney');
  });

  it('handles `_findLastKey` JMESPath function extension', () => {
    const users = {
      barney: { age: 36, active: true },
      fred: { age: 40, active: false },
      pebbles: { age: 1, active: true },
    };
    expect(search(users, "_findLastKey(@, as_lambda('o => o.age < 40'))")).toStrictEqual('pebbles');
    expect(search(users, '_findLastKey(@, { age: `36`, active: `true` })')).toStrictEqual('barney');
    expect(search(users, "_findLastKey(@, ['active', `false` ])")).toStrictEqual('fred');
    expect(search(users, "_findLastKey(@, 'active')")).toStrictEqual('pebbles');
  });

  it('handles `_get` JMESPath function extension', () => {
    const object = { a: [{ b: { c: 3 } }] };
    expect(search(object, "_get(@, 'a[0].b.c')")).toStrictEqual(3);
    expect(search(object, "_get(@, ['a', '0', 'b', 'c'])")).toStrictEqual(3);
    expect(search(object, "_get(@, 'a.b.c', 'default')")).toStrictEqual('default');
  });

  it('handles `_has` JMESPath function extension', () => {
    const object = { a: { b: 2 } };
    const other = { b: { a: 2 } };
    expect(search(object, "_has(@, 'a')")).toStrictEqual(true);
    expect(search(object, "_has(@, 'a.b')")).toStrictEqual(true);
    expect(search(object, "_has(@, ['a', 'b'])")).toStrictEqual(true);
    expect(search(other, "_has(@, 'a')")).toStrictEqual(false);
  });

  it('handles `_invert` JMESPath function extension', () => {
    const object = { a: 1, b: 2, c: 1 };
    expect(search(object, '_invert(@)')).toStrictEqual({ '1': 'c', '2': 'b' });
  });

  it('handles `_invertBy` JMESPath function extension', () => {
    const object = { a: 1, b: 2, c: 1 };
    expect(search(object, '_invertBy(@)')).toStrictEqual({ '1': ['a', 'c'], '2': ['b'] });
    expect(search(object, "_invertBy(@, as_lambda('v => `group${v}`'))")).toStrictEqual({
      group1: ['a', 'c'],
      group2: ['b'],
    });
  });

  it('handles `_invoke` JMESPath function extension', () => {
    const object = { a: [{ b: { c: [1, 2, 3, 4] } }] };
    expect(search(object, "_invoke(@, 'a[0].b.c.slice', `1`, `3`)")).toStrictEqual([2, 3]);
  });

  it('handles `_keys` JMESPath function extension', () => {
    expect(search({ a: 1, b: 2 }, '_keys(@)')).toStrictEqual(['a', 'b']);
    expect(search(['a', 'b'], '_keys(@)')).toStrictEqual(['0', '1']);
    expect(search('ab', '_keys(@)')).toStrictEqual(['0', '1']);
  });

  it('handles `_mapKeys` JMESPath function extension', () => {
    expect(search({ a: 1, b: 2 }, "_mapKeys(@, as_lambda('(v, k) => k + v'))")).toStrictEqual({ a1: 1, b2: 2 });
  });

  it('handles `_mapValues` JMESPath function extension', () => {
    const users = {
      fred: { user: 'fred', age: 40 },
      pebbles: { user: 'pebbles', age: 1 },
    };
    expect(search(users, "_mapValues(@, as_lambda('o => o.age'))")).toStrictEqual({ fred: 40, pebbles: 1 });
    expect(search(users, "_mapValues(@, 'age')")).toStrictEqual({ fred: 40, pebbles: 1 });
  });

  it('handles `_merge` JMESPath function extension', () => {
    const object = {
      a: [{ b: 2 }, { d: 4 }],
    };

    const other = {
      a: [{ c: 3 }, { e: 5 }],
    };
    expect(search([object, other], '_merge([0], [1])')).toStrictEqual({
      a: [
        { b: 2, c: 3 },
        { d: 4, e: 5 },
      ],
    });
  });

  it('handles `_omit` JMESPath function extension', () => {
    const object = { a: 1, b: '2', c: 3 };
    expect(search(object, "_omit(@, 'a', 'c')")).toStrictEqual({ b: '2' });
    expect(search(object, "_omit(@, ['a'], ['c'])")).toStrictEqual({ b: '2' });
    expect(search(object, "_omit(@, ['a', 'c'])")).toStrictEqual({ b: '2' });
  });

  it('handles `_omitBy` JMESPath function extension', () => {
    const object = { a: 1, b: '2', c: 3 };
    expect(search(object, "_omitBy(@, as_lambda('x => typeof x === `number`'))")).toStrictEqual({ b: '2' });
  });

  it('handles `_pick` JMESPath function extension', () => {
    const object = { a: 1, b: '2', c: 3 };
    expect(search(object, "_pick(@, 'a', 'c')")).toStrictEqual({ a: 1, c: 3 });
    expect(search(object, "_pick(@, ['a'], ['c'])")).toStrictEqual({ a: 1, c: 3 });
    expect(search(object, "_pick(@, ['a', 'c'])")).toStrictEqual({ a: 1, c: 3 });
  });

  it('handles `_pickBy` JMESPath function extension', () => {
    const object = { a: 1, b: '2', c: 3 };
    expect(search(object, "_pickBy(@, as_lambda('x => typeof x === `number`'))")).toStrictEqual({ a: 1, c: 3 });
  });

  it('handles `_set` JMESPath function extension', () => {
    const object = { a: [{ b: { c: 3 } }] };
    search(object, "_set(@, 'a[0].b.c', `4`)");
    expect(object).toStrictEqual({ a: [{ b: { c: 4 } }] });
    search(object, "_set(@, ['x', '0', 'y', 'z'], `5`)");
    expect(object).toStrictEqual({ a: [{ b: { c: 4 } }], x: [{ y: { z: 5 } }] });
  });

  it('handles `_toPairs` JMESPath function extension', () => {
    const object = { a: 1, b: '2', c: 3 };
    expect(search(object, '_toPairs(@)')).toStrictEqual([
      ['a', 1],
      ['b', '2'],
      ['c', 3],
    ]);
  });

  it('handles `_entries` JMESPath function extension', () => {
    const object = { a: 1, b: '2', c: 3 };
    expect(search(object, '_entries(@)')).toStrictEqual([
      ['a', 1],
      ['b', '2'],
      ['c', 3],
    ]);
  });

  it('handles `_transform` JMESPath function extension', () => {
    expect(
      search([2, 3, 4], "_transform(@, as_lambda('(result, n) => {result.push(n*n); return n %2 === 0}'), `[]`)"),
    ).toStrictEqual([4, 9]);
    expect(
      search(
        { a: 1, b: 2, c: 1 },
        "_transform(@, as_lambda('(r, v, k) => Object.assign(r, {[v]: [...(r[v] || []), k]})'), `{}`)",
      ),
    ).toStrictEqual({ '1': ['a', 'c'], '2': ['b'] });
  });

  it('handles `_unset` JMESPath function extension', () => {
    const object = { a: [{ b: { c: 7 } }] };
    expect(search(object, "_unset(@, 'a[0].b.c')")).toStrictEqual(true);
    expect(object).toStrictEqual({ a: [{ b: {} }] });
    search(object, "_unset(@, ['a', '0', 'b', 'c'])");
    expect(object).toStrictEqual({ a: [{ b: {} }] });
  });

  it('handles `_update` JMESPath function extension', () => {
    const object = { a: [{ b: { c: 3 } }] };
    search(object, "_update(@, 'a[0].b.c', as_lambda('n => n * n'))");
    expect(object).toStrictEqual({ a: [{ b: { c: 9 } }] });
    search(object, "_update(@, ['a', '0', 'b', 'c'], as_lambda('n => n * n'))");
    expect(object).toStrictEqual({ a: [{ b: { c: 81 } }] });
    search(object, "_update(@, 'x[0].y.z', as_lambda('n => n ? n + 1 : 0') )");
    expect(object).toStrictEqual({ a: [{ b: { c: 81 } }], x: [{ y: { z: 0 } }] });
  });

  it('handles `_values` JMESPath function extension', () => {
    const object = { a: 1, b: '2', c: 3 };
    expect(search(object, '_values(@)')).toStrictEqual([1, '2', 3]);
    expect(search('Hi', '_values(@)')).toStrictEqual(['H', 'i']);
  });
});
