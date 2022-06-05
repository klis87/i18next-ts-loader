import * as React from 'react';
import { useTranslation } from 'react-i18next';

import locale, { namespace } from './common.i18n';
import LanguagePicker from './components/language-picker';

const App = () => {
  const { t } = useTranslation(namespace);

  return (
    <div>
      <h1>i18next-ts-loader - {t(locale.title.basicExample)}</h1>
      <LanguagePicker />
    </div>
  );
};

export default App;
