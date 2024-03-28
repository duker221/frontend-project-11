import axios from 'axios';
import { parseData } from './parseData.js';
import { uniqueId } from 'lodash';

const loadFeeds = (url, state) => {
  const proxyUrl = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`;
  state.load.status = 'waiting';
  axios
    .get(proxyUrl)
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error('Failed to fetch data');
      }
    })
    .then((data) => {
      const parsedData = parseData(data.contents);
      const feed = {
        id: uniqueId(),
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
      return data.contents;
    })
    .then(() => console.log(state.rssContent.feeds.posts))
    .catch((error) => console.log(`Error: ${error}`));
};

export { loadFeeds };
