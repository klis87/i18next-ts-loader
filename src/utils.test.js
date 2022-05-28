const { mapObject, getI18nTypes } = require('./utils');

describe('utils', () => {
  describe('mapObject', () => {
    it('maps values correctly', () => {
      expect(mapObject({ x: 1, y: 2 }, (k, v) => [k, v * v])).toEqual({
        x: 1,
        y: 4,
      });
    });

    it('removes keys for undefined values', () => {
      expect(mapObject({ x: null, y: undefined }, (k, v) => [k, v])).toEqual({
        x: null,
      });
    });

    it('can update keys', () => {
      expect(mapObject({ x: 1, y: 2 }, (k, v) => [`${k}_suffix`, v])).toEqual({
        x_suffix: 1,
        y_suffix: 2,
      });
    });
  });

  describe('getI18nTypes', () => {
    it('supports flat translations', () => {
      expect(
        getI18nTypes(
          {
            name: 'Name',
            surname: 'Surname',
          },
          'common:',
        ),
      ).toEqual({ name: 'common:name', surname: 'common:surname' });
    });

    it('supports nested translations', () => {
      expect(
        getI18nTypes(
          {
            name: 'Name',
            nested: {
              surname: 'Surname',
            },
          },
          'common:',
        ),
      ).toEqual({
        name: 'common:name',
        nested: { surname: 'common:nested.surname' },
      });
    });

    it('strips plural suffixes', () => {
      expect(
        getI18nTypes(
          {
            name_singular: 'Name',
            name_plural: 'Names',
            nested: {
              surname_0: 'Surname',
              surname_1: 'Surnames',
            },
          },
          'common:',
        ),
      ).toEqual({
        name: 'common:name',
        nested: { surname: 'common:nested.surname' },
      });
    });
  });
});
