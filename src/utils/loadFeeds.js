import axios from 'axios';
import { parseData } from './parseData.js';

const loadFeeds = (url, state) => {
  const proxyUrl = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;
  state.load.status = 'waitingResponse';
  state.form.valid = 'waitingResponse';

  axios
    .get(proxyUrl)
    .then((response) => {
      if (response.status === 200) {
        const data = response.data;
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
          };
          feed.posts.push(post);
        });
        state.rssContent.feeds.push(feed);
        state.load.status = 'waitingData';
        state.form.valid = 'filling';
        return data.contents;
      } else {
        state.load.status = 'error';
        console.log(new Error('Failed to fetch data'));
      }
    })
    .then(() => {
      state.load.status = 'waitingData';
      state.form.valid = 'filling';
    })
    .catch((error) => {
      state.load.status = 'error';
      console.log(`Error: ${error}`);
    });
};

export { loadFeeds };
