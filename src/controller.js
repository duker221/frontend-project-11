import { watchedState } from './state.js';
import { validateUrl } from './validateUrl.js';
import ru from './locales/ru.js';
import i18next from 'i18next';
import * as yup from 'yup';

export default async () => {
  yup.setLocale({
    string: {
      url: 'validError',
    },
  });

  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    resources: {
      ru,
    },
  });

  watchedState.form.url = '';
  watchedState.form.valid = true;
  watchedState.form.errors = [];

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    button: document.querySelector('[type="submit"]'),
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = elements.input.value;

    validateUrl(url, watchedState)
      .then(() => {
        watchedState.form.valid = true;
        watchedState.form.errors = [];
        watchedState.form.feeds.push(url);
        console.log('Форма валидна, отправка данных', url);
        console.log(watchedState);
        elements.form.reset();
        elements.input.focus();
      })
      .catch((error) => {
        watchedState.form.valid = false;
        watchedState.form.errors.push(i18nextInstance.t('validError'));
        console.error('Ошибка валидации:', error.message);
        console.log(watchedState);
      });
  });

  elements.input.addEventListener('input', (e) => {
    watchedState.form.url = e.target.value;
  });
};
