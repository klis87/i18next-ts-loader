import '@babel/polyfill';
import React, { Suspense } from 'react';
import { render } from 'react-dom';
import i18next from 'i18next';
import i18nextXHRBackend from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';

import App from './app';

i18next
  .use(i18nextXHRBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng: 'en',
    defaultNS: null,
    ns: [],
    languages: ['pl', 'en'],
    debug: process.env.NODE_ENV !== 'production',
    load: 'languageOnly',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      bindStore: '',
    },
  });

const renderApp = () => {
  render(
    <Suspense fallback={null}>
      <App />
    </Suspense>,
    document.getElementById('root'),
  );
};

renderApp();

if (module.hot) {
  module.hot.accept('./app', renderApp);
}
