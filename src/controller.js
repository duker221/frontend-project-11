import i18next from 'i18next';
import * as yup from 'yup';
import onChange from 'on-change';
import ru from './locales/ru.js';
import { loadFeeds } from './utils/loadFeeds.js';
import {
  renderInput, renderFeeds, renderPosts, renderModal,
} from './view.js';

export default async () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    resources: {
      ru,
    },
  });
  yup.setLocale({
    string: {
      url: 'validError',
      success: 'success',
    },
    mixed: {
      notOneOf: 'duplicateUrl',
    },
  });

  const urlSchema = yup.object({ url: yup.string().url().required() });

  const validateUrl = (url, state) => new Promise((resolve, reject) => {
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
      posts: [],
    },
    userInterface: {
      activePost: null,
      watchedPostsId: new Set(),
    },
  };

  const watchedState = onChange(state, (path) => {
    if (path === 'form.valid' || path === 'form.validationErrors') {
      renderInput(watchedState, i18nextInstance);
    }
    if (path === 'rssContent.feeds') {
      renderFeeds(watchedState, i18nextInstance);
    }
    if (path === 'rssContent.posts') {
      renderPosts(watchedState, i18nextInstance);
    }
    if (path === 'userInterface.activePost') {
      renderModal(watchedState);
    }
    if (path === 'userInterface.watchedPostsId') {
      renderPosts(watchedState, i18nextInstance);
    }
  });

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    button: document.querySelector('[type="submit"]'),
    modal: document.getElementById('modal'),
    posts: document.querySelector('.posts'),
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = elements.input.value;
    validateUrl(url, watchedState)
      .then(() => {
        watchedState.form.valid = 'valid';
        watchedState.form.validUrls.push(url);
        console.log('Форма валидна, отправка данных', url);
        loadFeeds(url, watchedState, i18nextInstance);
        console.log(watchedState);
      })
      .catch((error) => {
        switch (error.message) {
          case i18nextInstance.t('duplicateUrl'):
            watchedState.form.validationErrors.unshift(
              i18nextInstance.t('duplicateUrl'),
            );
            break;
          case 'validError':
            watchedState.form.validationErrors.unshift(
              i18nextInstance.t('validError'),
            );
            break;
          case 'notRss':
            watchedState.form.validationErrors.unshift(
              i18nextInstance.t('notRss'),
            );
            break;
          default:
            watchedState.form.validationErrors.unshift(
              i18nextInstance.t('errorNetwork'),
            );
        }
        watchedState.form.valid = 'invalid';
        console.error('Ошибка валидации:', error.message);
        console.log(watchedState);
      });
  });

  elements.posts.addEventListener('click', (e) => {
    const clickId = e.target.dataset.id;
    console.log(clickId);
    if (clickId) {
      watchedState.userInterface.activePost = clickId;
      watchedState.userInterface.watchedPostsId.add(clickId);
    }
  });
};
