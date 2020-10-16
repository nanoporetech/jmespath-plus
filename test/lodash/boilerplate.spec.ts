import { search } from '../../src';

describe('LODASH EXTENSIONS (LANG)', () => {
  it('handles `_castArray` JMESPath function extension', () => {
    expect(search(1, '_castArray(@)')).toStrictEqual([1]);
    expect(search({ a: 1 }, '_castArray(@)')).toStrictEqual([{ a: 1 }]);
    expect(search('abc', '_castArray(@)')).toStrictEqual(['abc']);
    expect(search(null, '_castArray(@)')).toStrictEqual([null]);
  });
});
