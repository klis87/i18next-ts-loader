// import { urlToRequest, stringifyRequest } from 'loader-utils';
// import { validate } from 'schema-utils';
// const { stringifyRequest } = require('loader-utils');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
// const schema = {
// type: 'object',
// properties: {
// test: {
// type: 'string',
// },
// },
// };

const { getI18nTypes } = require('./utils');

// TODO:
// hash

function plugin(source) {
  // const options = this.getOptions();

  // validate(schema, options, {
  //   name: 'Example Loader',
  //   baseDataPath: 'options',
  // });

  const hashSum =
    this.mode === 'production'
      ? crypto.createHash('sha256').update(source).digest('hex')
      : null;

  const json = JSON.parse(source);

  const languages = Object.keys(json);

  const namespace = `${this.resourcePath
    .replace(this.rootContext, '')
    .slice(1)
    .replace('.i18n', '')
    .replaceAll('/', '_')}${hashSum ? `_${hashSum}` : ''}`;

  const i18nTypes = getI18nTypes(json[languages[0]], `${namespace}:`);

  fs.writeFileSync(
    `${this.resourcePath}.d.ts`,
    `declare const locales = ${JSON.stringify(
      i18nTypes,
    )} as const;export default locales;
    export const namespace = '${namespace}' as const;
    `,
  );

  languages.forEach((language) => {
    fs.mkdirSync(
      path.dirname(`${this.rootContext}/locales/${language}/${namespace}.json`),
      { recursive: true },
    );
    fs.writeFileSync(
      `${this.rootContext}/locales/${language}/${namespace}.json`,
      JSON.stringify(json[language]),
    );
  });

  return `export default ${JSON.stringify(
    i18nTypes,
  )};export const namespace = '${namespace}'`;
}

module.exports = plugin;
