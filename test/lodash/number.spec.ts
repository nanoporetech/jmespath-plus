import { search } from '../../src';

describe('LODASH EXTENSIONS (NUMBER)', () => {
  it('handles `_clamp` JMESPath function extension', () => {
    expect(search(-10, '_clamp(@, `-5`, `5`)')).toStrictEqual(-5);
    expect(search(-10, '_clamp(@, `-5`, `5`)')).toStrictEqual(-5);
    expect(search(10, '_clamp(@, `5`)')).toStrictEqual(5);
  });

  it('handles `_inRange` JMESPath function extension', () => {
    expect(search([3, 2, 4], '_inRange([0], [1], [2])')).toStrictEqual(true);
    expect(search([4, 8], '_inRange([0], [1])')).toStrictEqual(true);
    expect(search([4, 2], '_inRange([0], [1])')).toStrictEqual(false);
    expect(search([2, 2], '_inRange([0], [1])')).toStrictEqual(false);
    expect(search([1.2, 2], '_inRange([0], [1])')).toStrictEqual(true);
    expect(search([5.2, 4], '_inRange([0], [1])')).toStrictEqual(false);
    expect(search([-3, -2, -6], '_inRange([0], [1], [2])')).toStrictEqual(true);
  });

  // it('handles `_random` JMESPath function extension', () => {
  //   expect(search([0, 5], '_random([0], [1])')).toBeGreaterThanOrEqual(0);
  //   expect(search([5], '_random([0])')).toStrictEqual(true);
  //   expect(search([5, true], '_random([0], [1])')).toStrictEqual(false);
  //   expect(search([1.2, 5.2], '_random([0], [1])')).toStrictEqual(false);
  // });
});
