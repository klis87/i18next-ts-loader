import * as React from 'react';
import { useTranslation } from 'react-i18next';

import locale, { namespace } from './language-picker.i18n';

const LanguagePicker = () => {
  const { t, i18n } = useTranslation(namespace);

  return (
    <div>
      <b>{t(locale.selectLanguage)}: </b>
      <button
        type="button"
        onClick={() => i18n.changeLanguage('en')}
        style={i18n.language === 'en' ? { fontWeight: 'bold' } : undefined}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => i18n.changeLanguage('pl')}
        style={i18n.language === 'pl' ? { fontWeight: 'bold' } : undefined}
      >
        PL
      </button>
    </div>
  );
};

export default LanguagePicker;
