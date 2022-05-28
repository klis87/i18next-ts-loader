const mapObject = (obj, callback) =>
  Object.entries(obj).reduce((prev, [k, v]) => {
    const [newKey, newValue] = callback(k, v);

    if (newValue === undefined) {
      return prev;
    }

    prev[newKey] = newValue;
    return prev;
  }, {});

const getI18nTypes = (obj, prefix) =>
  mapObject(obj, (k, v) => {
    if (typeof v === 'string') {
      const normalizedK = k.split('_')[0];
      return [normalizedK, prefix + normalizedK];
    }

    return [k, getI18nTypes(v, `${prefix}${k}.`)];
  });

exports.mapObject = mapObject;
exports.getI18nTypes = getI18nTypes;
