// import { validate } from 'schema-utils';
const { interpolateName } = require('loader-utils');
const fs = require('fs');
const path = require('path');

// const schema = {
//   type: 'object',
//   properties: {
//     localeFilesPattern: {
//       type: 'string',
//     },
//   },
// };

const { getI18nTypes, getLocalePath } = require('./utils');

function plugin(source) {
  const { localeFilesPattern = '/locales/{{lng}}/{{ns}}.json' } =
    this.getOptions();

  // validate(schema, options, {
  //   name: 'Example Loader',
  //   baseDataPath: 'options',
  // });

  const hashSum =
    this.mode === 'production'
      ? interpolateName(this, '[contenthash]', {
          content: source,
        })
      : null;

  const namespace = `${this.resourcePath
    .replace(this.rootContext, '')
    .slice(1)
    .replace('.i18n', '')
    .replaceAll('/', '_')}${hashSum ? `_${hashSum}` : ''}`;
  const json = JSON.parse(source);

  const languages = Object.keys(json);

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
    const localePath = getLocalePath(language, namespace, localeFilesPattern);

    fs.mkdirSync(path.dirname(this.rootContext + localePath), {
      recursive: true,
    });
    fs.writeFileSync(
      this.rootContext + localePath,
      JSON.stringify(json[language]),
    );
  });

  return `export default ${JSON.stringify(
    i18nTypes,
  )};export const namespace = '${namespace}'`;
}

module.exports = plugin;
