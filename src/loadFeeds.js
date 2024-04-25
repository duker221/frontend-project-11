/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import { uniqueId } from 'lodash';
import { parseData } from './parseData.js';

const getProxiedUrl = (link) => {
  const url = new URL('https://allorigins.hexlet.app/get');
  url.searchParams.append('disableCache', 'true');
  url.searchParams.append('url', link);
  return url.toString();
};

const loadFeeds = (url, state, i18nextInstance) => {
  const proxyUrl = getProxiedUrl(url);
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
          feed.url = url;
          feed.id = uniqueId();
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

const updateContent = (state) => {
  if (state.rssContent.feeds.length === 0) {
    setTimeout(() => updateContent(state), 5000);
    return;
  }
  const { feeds } = state.rssContent;
  const promises = feeds.map((feed) => axios
    .get(getProxiedUrl(feed.url))
    .then((response) => {
      const { posts } = parseData(response.data.contents);
      const oldPosts = state.rssContent.posts.map((post) => post.link);
      const newPosts = posts
        .filter((post) => !oldPosts.includes(post.link))
        .map((post) => ({ ...post, id: uniqueId() }));
      state.rssContent.posts.unshift(...newPosts);
    })
    .catch((e) => {
      console.log(e);
    }));
  Promise.all(promises).then(() => setTimeout(() => updateContent(state), 5000));
};

export { loadFeeds, updateContent };
