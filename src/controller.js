import ru from './locales/ru.js';
import i18next from 'i18next';
import * as yup from 'yup';
import { loadFeeds } from './utils/loadFeeds.js';
import { parseData } from './utils/parseData.js';
import onChange from 'on-change';
import { renderInput, renderFeeds, renderPosts } from './view.js';

export default async () => {
  yup.setLocale({
    string: {
      url: 'validError',
      success: 'success',
    },
  });

  const urlSchema = yup.object({ url: yup.string().url().required() });

  const validateUrl = (url, state) =>
    new Promise((resolve, reject) => {
      const { validUrls } = state.form;
      if (validUrls.includes(url)) {
        reject(new Error(i18nextInstance.t('duplicateUrl')));
      }
      urlSchema
        .validate({ url })
        .then(() => {
          resolve('Success!');
        })
        .catch((e) => {
          reject(e);
        });
    });

  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    resources: {
      ru,
    },
  });

  const state = {
    form: {
      valid: 'filling',
      validUrls: [],
      validationErrors: [],
    },
    load: {
      status: 'waitingData',
    },
    rssContent: {
      feeds: [],
    },
  };

  const watchedState = onChange(state, (path, value, previousValue) => {
    if (path === 'form.valid' || path === 'form.validationErrors') {
      renderInput(watchedState, i18nextInstance);
    }
    if (path === 'rssContent.feeds') {
      renderFeeds(watchedState, i18nextInstance);
      renderPosts(watchedState, i18nextInstance);
    }
  });

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
        watchedState.form.valid = 'valid';
        watchedState.form.validUrls.push(url);
        console.log('Форма валидна, отправка данных', url);
        loadFeeds(url, watchedState);
        console.log(watchedState);
      })
      .catch((error) => {
        switch (error.message) {
          case i18nextInstance.t('duplicateUrl'):
            watchedState.form.validationErrors.unshift(
              i18nextInstance.t('duplicateUrl'),
            );
            break;
          case i18nextInstance.t('validError'):
            watchedState.form.validationErrors.unshift(
              i18nextInstance.t('validError'),
            );
            break;
        }
        watchedState.form.valid = 'invalid';
        console.error('Ошибка валидации:', error.message);
        console.log(watchedState);
      });
  });
};
