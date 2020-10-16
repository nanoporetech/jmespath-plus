import { search } from '../../src';

describe('LODASH EXTENSIONS (LANG)', () => {
  it('handles `_castArray` JMESPath function extension', () => {
    expect(search(1, '_castArray(@)')).toStrictEqual([1]);
    expect(search({ a: 1 }, '_castArray(@)')).toStrictEqual([{ a: 1 }]);
    expect(search('abc', '_castArray(@)')).toStrictEqual(['abc']);
    expect(search(null, '_castArray(`null`)')).toStrictEqual([null]);
  });

  it('handles `_eq` JMESPath function extension', () => {
    const array = [{ a: 1 }, { a: 1 }];
    expect(search(array, '_eq([0], [0])')).toStrictEqual(true);
    expect(search(array, '_eq([0], [1])')).toStrictEqual(false);
    expect(search(array, "_eq('a', 'a')")).toStrictEqual(true);
    expect(search(array, "_eq('a', as_lambda('() => Object(`a`)'))")).toStrictEqual(false);
    expect(search(array, '_eq(`null`, `null`)')).toStrictEqual(true);
  });

  it('handles `_gt` JMESPath function extension', () => {
    const array = [{ a: 1 }, { a: 1 }];
    expect(search(array, '_gt(`3`, `1`)')).toStrictEqual(true);
    expect(search(array, '_gt(`3`, `3`)')).toStrictEqual(false);
    expect(search(array, '_gt(`1`, `3`)')).toStrictEqual(false);
  });

  it('handles `_gte` JMESPath function extension', () => {
    const array = [{ a: 1 }, { a: 1 }];
    expect(search(array, '_gte(`3`, `1`)')).toStrictEqual(true);
    expect(search(array, '_gte(`3`, `3`)')).toStrictEqual(true);
    expect(search(array, '_gte(`1`, `3`)')).toStrictEqual(false);
  });

  it('handles `_lt` JMESPath function extension', () => {
    const array = [{ a: 1 }, { a: 1 }];
    expect(search(array, '_lt(`3`, `1`)')).toStrictEqual(false);
    expect(search(array, '_lt(`3`, `3`)')).toStrictEqual(false);
    expect(search(array, '_lt(`1`, `3`)')).toStrictEqual(true);
  });

  it('handles `_lte` JMESPath function extension', () => {
    const array = [{ a: 1 }, { a: 1 }];
    expect(search(array, '_lte(`3`, `1`)')).toStrictEqual(false);
    expect(search(array, '_lte(`3`, `3`)')).toStrictEqual(true);
    expect(search(array, '_lte(`1`, `3`)')).toStrictEqual(true);
  });
});
