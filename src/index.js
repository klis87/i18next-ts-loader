// import { urlToRequest, stringifyRequest } from 'loader-utils';
// import { validate } from 'schema-utils';
// const { stringifyRequest } = require('loader-utils');
const fs = require('fs');
const path = require('path');
// const schema = {
// type: 'object',
// properties: {
// test: {
// type: 'string',
// },
// },
// };

// TODO:
// plural
// hash

const mapObject = (obj, callback) =>
  Object.entries(obj).reduce((prev, [k, v]) => {
    const [newKey, newValue] = callback(k, v);

    if (newValue === undefined) {
      return prev;
    }

    prev[newKey] = newValue;
    return prev;
  }, {});

const getI18nTypes = (obj, prefix) => {
  return mapObject(obj, (k, v) => {
    if (typeof v === 'string') {
      const normalizedK = k.split('_')[0];
      return [normalizedK, prefix + normalizedK];
    }


    return [k, getI18nTypes(v, `${prefix}${k}.`)];
  });
};

function plugin(source) {
  // const options = this.getOptions();

  // validate(schema, options, {
  //   name: 'Example Loader',
  //   baseDataPath: 'options',
  // });

  const json = JSON.parse(source);

  const languages = Object.keys(json);

  const relativePath = this.resourcePath
    .replace(this.rootContext, '')
    .slice(1)
    .replace('.i18n', '')
    .replaceAll('/', '_');

  const response = getI18nTypes(json[languages[0]], `${relativePath}:`);

  fs.writeFileSync(
    `${this.resourcePath}.d.ts`,
    `declare const locales = ${JSON.stringify(
      response,
    )} as const;export default locales;
    export const namespace = '${relativePath}' as const;
    `,
  );

  languages.forEach(language => {
    fs.mkdirSync(path.dirname(`${this.rootContext}/locales/${language}/${relativePath}.json`), { recursive: true })
    fs.writeFileSync(
      `${this.rootContext}/locales/${language}/${relativePath}.json`,
      JSON.stringify(json[language]),
    );
  });

  return `export default ${JSON.stringify(
    response,
  )};export const namespace = '${relativePath}'`;
}

module.exports = plugin;
