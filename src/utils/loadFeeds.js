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
      if (response.status >= 200 && response.status <= 299) {
        const { data } = response;
        const parsedData = parseData(data.contents);

        const feed = {
          title: parsedData.querySelector('title').textContent,
          description: parsedData.querySelector('description').textContent,
        };
        const isUniqueFeed = !state.rssContent.feeds.some(
          (uniqFeed) => uniqFeed.title === feed.title,
        );
        if (isUniqueFeed) {
          state.rssContent.feeds.push(feed);
        }
        const items = parsedData.querySelectorAll('item');
        items.forEach((item) => {
          const link = item.querySelector('link').textContent;
          const isUnique = !state.rssContent.posts.some(
            (post) => post.link === link,
          );
          if (isUnique) {
            const post = {
              title: item.querySelector('title').textContent,
              link,
              description: item.querySelector('description').textContent,
              id: uniqueId(),
            };
            state.rssContent.posts.push(post);
          }
        });
      } else {
        throw new Error('Network response was not ok.');
      }
    })
    .then(() => {
      state.load.status = 'waitingData';
      state.form.valid = 'filling';
      console.log(state);
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
      state.load.status = 'invalid';
      state.form.valid = 'invalid';
      state.form.validationErrors.push(i18nextInstance.t('notRss'));
    });
};

export { loadFeeds };
