import { search } from '../../src';

describe('LODASH EXTENSIONS (STRING)', () => {
  it('handles `_camelCase` JMESPath function extension', () => {
    expect(search('Foo Bar', '_camelCase(@)')).toStrictEqual('fooBar');
    expect(search('--foo-bar--', '_camelCase(@)')).toStrictEqual('fooBar');
    expect(search('__FOO_BAR__', '_camelCase(@)')).toStrictEqual('fooBar');
  });

  it('handles `_capitalize` JMESPath function extension', () => {
    expect(search('FRED', '_capitalize(@)')).toStrictEqual('Fred');
  });

  it('handles `_deburr` JMESPath function extension', () => {
    expect(search('déjà vu', '_deburr(@)')).toStrictEqual('deja vu');
  });

  it('handles `_endsWith` JMESPath function extension', () => {
    expect(search('abc', "_endsWith(@, 'c')")).toStrictEqual(true);
    expect(search('abc', "_endsWith(@, 'b')")).toStrictEqual(false);
    expect(search('abc', "_endsWith(@, 'b', `2`)")).toStrictEqual(true);
  });

  it('handles `_escape` JMESPath function extension', () => {
    expect(search('fred, barney, & pebbles', '_escape(@)')).toStrictEqual('fred, barney, &amp; pebbles');
  });

  it('handles `_escapeRegExp` JMESPath function extension', () => {
    expect(search('[lodash](https://lodash.com/)', '_escapeRegExp(@)')).toStrictEqual(
      '\\[lodash\\]\\(https://lodash\\.com/\\)',
    );
  });

  it('handles `_kebabCase` JMESPath function extension', () => {
    expect(search('Foo Bar', '_kebabCase(@)')).toStrictEqual('foo-bar');
    expect(search('--foo-bar--', '_kebabCase(@)')).toStrictEqual('foo-bar');
    expect(search('__FOO_BAR__', '_kebabCase(@)')).toStrictEqual('foo-bar');
  });

  it('handles `_lowerCase` JMESPath function extension', () => {
    expect(search('--Foo-Bar--', '_lowerCase(@)')).toStrictEqual('foo bar');
    expect(search('fooBar', '_lowerCase(@)')).toStrictEqual('foo bar');
    expect(search('__FOO_BAR__', '_lowerCase(@)')).toStrictEqual('foo bar');
  });

  it('handles `_lowerFirst` JMESPath function extension', () => {
    expect(search('Fred', '_lowerFirst(@)')).toStrictEqual('fred');
    expect(search('FRED', '_lowerFirst(@)')).toStrictEqual('fRED');
  });

  it('handles `_pad` JMESPath function extension', () => {
    expect(search('abc', '_pad(@, `8`)')).toStrictEqual('  abc   ');
    expect(search('abc', "_pad(@, `8`, '_-')")).toStrictEqual('_-abc_-_');
    expect(search('abc', '_pad(@, `3`)')).toStrictEqual('abc');
  });

  it('handles `_padEnd` JMESPath function extension', () => {
    expect(search('abc', '_padEnd(@, `6`)')).toStrictEqual('abc   ');
    expect(search('abc', "_padEnd(@, `6`, '_-')")).toStrictEqual('abc_-_');
    expect(search('abc', '_padEnd(@, `3`)')).toStrictEqual('abc');
  });

  it('handles `_padStart` JMESPath function extension', () => {
    expect(search('abc', '_padStart(@, `6`)')).toStrictEqual('   abc');
    expect(search('abc', "_padStart(@, `6`, '_-')")).toStrictEqual('_-_abc');
    expect(search('abc', '_padStart(@, `3`)')).toStrictEqual('abc');
  });

  it('handles `_parseInt` JMESPath function extension', () => {
    expect(search('08', '_parseInt(@)')).toStrictEqual(8);
    expect(search('ff', '_parseInt(@, `16`)')).toStrictEqual(255);
  });

  it('handles `_repeat` JMESPath function extension', () => {
    expect(search('*', '_repeat(@, `3`)')).toStrictEqual('***');
    expect(search('abc', '_repeat(@, `2`)')).toStrictEqual('abcabc');
    expect(search('abc', '_repeat(@, `0`)')).toStrictEqual('');
  });

  it('handles `_replace` JMESPath function extension', () => {
    expect(search('Hi Fred', "_replace(@, 'Fred', 'Barney')")).toStrictEqual('Hi Barney');
    expect(search('Hi Fred', "_replace(@, as_regexp('[edr]+'), 'lower')")).toStrictEqual('Hi Flower');
  });

  it('handles `_snakeCase` JMESPath function extension', () => {
    expect(search('Foo Bar', '_snakeCase(@)')).toStrictEqual('foo_bar');
    expect(search('fooBar', '_snakeCase(@)')).toStrictEqual('foo_bar');
    expect(search('--FOO-BAR--', '_snakeCase(@)')).toStrictEqual('foo_bar');
  });

  it('handles `_split` JMESPath function extension', () => {
    expect(search('a-b-c', "_split(@, '-', `2`)")).toStrictEqual(['a', 'b']);
  });

  it('handles `_startCase` JMESPath function extension', () => {
    expect(search('--foo-bar--', '_startCase(@)')).toStrictEqual('Foo Bar');
    expect(search('fooBar', '_startCase(@)')).toStrictEqual('Foo Bar');
    expect(search('__FOO_BAR__', '_startCase(@)')).toStrictEqual('FOO BAR');
  });

  it('handles `_startsWith` JMESPath function extension', () => {
    expect(search('abc', "_startsWith(@, 'a')")).toStrictEqual(true);
    expect(search('abc', "_startsWith(@, 'b')")).toStrictEqual(false);
    expect(search('abc', "_startsWith(@, 'b', `1`)")).toStrictEqual(true);
  });

  it('handles `_toLower` JMESPath function extension', () => {
    expect(search('--Foo-Bar--', '_toLower(@)')).toStrictEqual('--foo-bar--');
    expect(search('fooBar', '_toLower(@)')).toStrictEqual('foobar');
    expect(search('__FOO_BAR__', '_toLower(@)')).toStrictEqual('__foo_bar__');
  });

  it('handles `_toUpper` JMESPath function extension', () => {
    expect(search('--Foo-Bar--', '_toUpper(@)')).toStrictEqual('--FOO-BAR--');
    expect(search('fooBar', '_toUpper(@)')).toStrictEqual('FOOBAR');
    expect(search('__FOO_BAR__', '_toUpper(@)')).toStrictEqual('__FOO_BAR__');
  });

  it('handles `_trim` JMESPath function extension', () => {
    expect(search('  abc  ', '_trim(@)')).toStrictEqual('abc');
    expect(search('-_-abc-_-', "_trim(@, '_-')")).toStrictEqual('abc');
  });

  it('handles `_trimEnd` JMESPath function extension', () => {
    expect(search('  abc  ', '_trimEnd(@)')).toStrictEqual('  abc');
    expect(search('-_-abc-_-', "_trimEnd(@, '_-')")).toStrictEqual('-_-abc');
  });

  it('handles `_trimStart` JMESPath function extension', () => {
    expect(search('  abc  ', '_trimStart(@)')).toStrictEqual('abc  ');
    expect(search('-_-abc-_-', "_trimStart(@, '_-')")).toStrictEqual('abc-_-');
  });

  it('handles `_unescape` JMESPath function extension', () => {
    expect(search('fred, barney, &amp; pebbles', '_unescape(@)')).toStrictEqual('fred, barney, & pebbles');
  });

  it('handles `_upperCase` JMESPath function extension', () => {
    expect(search('--foo-bar--', '_upperCase(@)')).toStrictEqual('FOO BAR');
    expect(search('fooBar', '_upperCase(@)')).toStrictEqual('FOO BAR');
    expect(search('__FOO_BAR__', '_upperCase(@)')).toStrictEqual('FOO BAR');
  });

  it('handles `_upperFirst` JMESPath function extension', () => {
    expect(search('fred', '_upperFirst(@)')).toStrictEqual('Fred');
    expect(search('fRED', '_upperFirst(@)')).toStrictEqual('FRED');
    expect(search('FRED', '_upperFirst(@)')).toStrictEqual('FRED');
  });

  it('handles `_words` JMESPath function extension', () => {
    expect(search('fred, barney, & pebbles', '_words(@)')).toStrictEqual(['fred', 'barney', 'pebbles']);
    expect(search('fred, barney, & pebbles', "_words(@, as_regexp('[^, ]+', 'g'))")).toStrictEqual([
      'fred',
      'barney',
      '&',
      'pebbles',
    ]);
  });
});
