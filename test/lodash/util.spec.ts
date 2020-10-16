import { search } from '../../src';

describe('LODASH EXTENSIONS (UTIL)', () => {
  it('handles `_range` JMESPath function extension', () => {
    expect(search(null, '_range(`4`)')).toStrictEqual([0, 1, 2, 3]);
    expect(search(null, '_range(`-4`)')).toStrictEqual([0, -1, -2, -3]);
    expect(search(null, '_range(`1`, `5`)')).toStrictEqual([1, 2, 3, 4]);
    expect(search(null, '_range(`0`, `20`, `5`)')).toStrictEqual([0, 5, 10, 15]);
    expect(search(null, '_range(`0`, `-4`, `-1`)')).toStrictEqual([0, -1, -2, -3]);
    expect(search(null, '_range(`1`, `4`, `0`)')).toStrictEqual([1, 1, 1]);
    expect(search(null, '_range(`0`)')).toStrictEqual([]);
  });
  it('handles `_rangeRight` JMESPath function extension', () => {
    expect(search(null, '_rangeRight(`4`)')).toStrictEqual([3, 2, 1, 0]);
    expect(search(null, '_rangeRight(`-4`)')).toStrictEqual([-3, -2, -1, 0]);
    expect(search(null, '_rangeRight(`1`, `5`)')).toStrictEqual([4, 3, 2, 1]);
    expect(search(null, '_rangeRight(`0`, `20`, `5`)')).toStrictEqual([15, 10, 5, 0]);
    expect(search(null, '_rangeRight(`0`, `-4`, `-1`)')).toStrictEqual([-3, -2, -1, 0]);
    expect(search(null, '_rangeRight(`1`, `4`, `0`)')).toStrictEqual([1, 1, 1]);
    expect(search(null, '_rangeRight(`0`)')).toStrictEqual([]);
  });
});
