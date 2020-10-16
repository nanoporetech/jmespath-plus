import { search } from '../../src';

describe('LODASH EXTENSIONS (MATH)', () => {
  it('handles `_add` JMESPath function extension', () => {
    const array = [6, 4];
    expect(search(array, '_add([0], [1])')).toStrictEqual(10);
  });

  it('handles `_ceil` JMESPath function extension', () => {
    expect(search(4.006, '_ceil(@)')).toStrictEqual(5);
    expect(search(6.004, '_ceil(@, `2`)')).toStrictEqual(6.01);
    expect(search(6040, '_ceil(@, `-2`)')).toStrictEqual(6100);
  });

  it('handles `_divide` JMESPath function extension', () => {
    const array = [6, 4];
    expect(search(array, '_divide([0], [1])')).toStrictEqual(1.5);
  });

  it('handles `_floor` JMESPath function extension', () => {
    expect(search(4.006, '_floor(@)')).toStrictEqual(4);
    expect(search(0.046, '_floor(@, `2`)')).toStrictEqual(0.04);
    expect(search(4060, '_floor(@, `-2`)')).toStrictEqual(4000);
  });

  it('handles `_max` JMESPath function extension', () => {
    const array = [4, 2, 8, 6];
    expect(search(array, '_max(@)')).toStrictEqual(8);
    expect(search([], '_max(@)')).toStrictEqual(undefined);
  });

  it('handles `_maxBy` JMESPath function extension', () => {
    const objects = [{ n: 1 }, { n: 2 }];
    expect(search(objects, "_maxBy(@, as_lambda('o => o.n'))")).toStrictEqual({ n: 2 });
    expect(search(objects, "_maxBy(@, 'n')")).toStrictEqual({ n: 2 });
  });

  it('handles `_mean` JMESPath function extension', () => {
    const array = [4, 2, 8, 6];
    expect(search(array, '_mean(@)')).toStrictEqual(5);
  });

  it('handles `_meanBy` JMESPath function extension', () => {
    const objects = [{ n: 4 }, { n: 2 }, { n: 8 }, { n: 6 }];
    expect(search(objects, "_meanBy(@, as_lambda('o => o.n'))")).toStrictEqual(5);
    expect(search(objects, "_meanBy(@, 'n')")).toStrictEqual(5);
  });

  it('handles `_min` JMESPath function extension', () => {
    const array = [4, 2, 8, 6];
    expect(search(array, '_min(@)')).toStrictEqual(2);
    expect(search([], '_min(@)')).toStrictEqual(undefined);
  });

  it('handles `_minBy` JMESPath function extension', () => {
    const objects = [{ n: 1 }, { n: 2 }];
    expect(search(objects, "_minBy(@, as_lambda('o => o.n'))")).toStrictEqual({ n: 1 });
    expect(search(objects, "_minBy(@, 'n')")).toStrictEqual({ n: 1 });
  });

  it('handles `_multiply` JMESPath function extension', () => {
    const array = [6, 4];
    expect(search(array, '_multiply([0], [1])')).toStrictEqual(24);
  });

  it('handles `_round` JMESPath function extension', () => {
    expect(search(4.006, '_round(@)')).toStrictEqual(4);
    expect(search(4.006, '_round(@, `2`)')).toStrictEqual(4.01);
    expect(search(4060, '_round(@, `-2`)')).toStrictEqual(4100);
  });

  it('handles `_subtract` JMESPath function extension', () => {
    const array = [6, 4];
    expect(search(array, '_subtract([0], [1])')).toStrictEqual(2);
  });

  it('handles `_sum` JMESPath function extension', () => {
    const array = [4, 2, 8, 6];
    expect(search(array, '_sum(@)')).toStrictEqual(20);
  });

  it('handles `_sumBy` JMESPath function extension', () => {
    const objects = [{ n: 4 }, { n: 2 }, { n: 8 }, { n: 6 }];
    expect(search(objects, "_sumBy(@, as_lambda('o => o.n'))")).toStrictEqual(20);
    expect(search(objects, "_sumBy(@, 'n')")).toStrictEqual(20);
  });
});
