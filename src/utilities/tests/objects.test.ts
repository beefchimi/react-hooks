import {filterNullishValuesFromObject} from '../objects';

describe('Object utilities', () => {
  describe('filterNullishValuesFromObject', () => {
    const truthyValues = {
      one: 1,
      two: '2',
      three: [1, 2, 3],
      four: {
        infinity: 'and beyond',
      },
      five: true,
      six: new Map(),
    };

    const nullishValues = {
      foo: null,
      bar: undefined,
    };

    const questionableValues = {
      definite: false,
      falsey: 0,
      maybe: NaN,
      null: 'null?',
      undefined: 'key does not equal value',
    };

    const mockObject = {
      ...truthyValues,
      ...nullishValues,
      ...questionableValues,
    };

    it('returns object with all keys pointing to nullish values removed', async () => {
      const result = filterNullishValuesFromObject(mockObject);

      expect(result).toStrictEqual({
        ...truthyValues,
        ...questionableValues,
      });

      expect(result).not.toHaveProperty('for');
      expect(result).not.toHaveProperty('bar');

      expect(result).toHaveProperty('maybe');
      expect(result).toHaveProperty('null');
    });
  });
});
