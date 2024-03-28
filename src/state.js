import onChange from 'on-change';
import { renderInput, renderFeeds } from './view.js';

const state = {
  form: {
    url: '',
    valid: true, //
    errors: [],
  },
  rssContent: {
    feeds: [],
  },
};

const watchedState = onChange(state, (path, value, previousValue) => {
  if (path === 'form') {
    renderInput(watchedState);
  }
  if (path === 'form.errors') {
    renderInput(watchedState);
  }
});

export { watchedState };
