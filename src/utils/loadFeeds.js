import axios from 'axios';
import { parseData } from './parseData.js';
import { uniqueId } from 'lodash';

const loadFeeds = (url, state) => {
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
          posts: [],
        };
        const items = parsedData.querySelectorAll('item');
        items.forEach((item) => {
          const post = {
            title: item.querySelector('title').textContent,
            link: item.querySelector('link').textContent,
            id: uniqueId(),
          };

          feed.posts.push(post);
        });
        state.rssContent.feeds.push(feed);
      } else {
        throw new Error('Network response was not ok.');
      }
    })
    .then(() => {
      state.load.status = 'waitingData';
      state.form.valid = 'filling';
    })
    .catch((error) => {
      state.load.status = 'error';
      state.form.validationErrors.push('Ошибка загрузки данных');
      console.error(`Error: ${error.message}`);
    });
};

export { loadFeeds };
