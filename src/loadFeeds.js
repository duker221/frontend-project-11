/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import { uniqueId } from 'lodash';
import { parseData } from './parseData.js';

let timerId;

const loadFeeds = (url, state, i18nextInstance) => {
  const proxyUrl = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;
  state.load.status = 'waitingResponse';
  state.form.valid = 'waitingResponse';

  axios
    .get(proxyUrl)
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        const { data } = response;
        const { feed, posts } = parseData(data.contents);

        const isUniqueFeed = !state.rssContent.feeds.some(
          (el) => el.title === feed.title,
        );
        if (isUniqueFeed) {
          state.rssContent.feeds.push(feed);
        }

        posts.forEach((post) => {
          const isUniquePost = !state.rssContent.posts.some(
            (p) => p.link === post.link,
          );
          if (isUniquePost) {
            const newPost = {
              ...post,
              id: uniqueId(),
            };
            state.rssContent.posts.push(newPost);
          }
        });
      } else {
        throw new Error('Network response was not ok.');
      }
    })
    .then(() => {
      state.load.status = 'waitingData';
      state.form.valid = 'filling';
    })
    .then(() => {
      timerId = setTimeout(() => {
        loadFeeds(url, state);
      }, 5000);
      if (state.load.status === 'error') {
        clearTimeout(timerId);
      }
    })
    .catch((error) => {
      if (!error.response && error.message === 'Network Error') {
        state.load.status = 'errorNetwork';
        state.form.valid = 'invalid';
        state.form.validationErrors.unshift(i18nextInstance.t('errorNetwork'));
      } else {
        state.load.status = 'error';
        state.form.valid = 'invalid';
        state.form.validationErrors.unshift(i18nextInstance.t('notRss'));
      }
    });
};

export { loadFeeds };
