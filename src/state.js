import onChange from 'on-change';
import { render } from './view.js';

const state = {
  form: {
    url: '',
    valid: true,
    feeds: [],
    errors: [],
  },
};

const watchedState = onChange(state, (path, value, previousValue) => {
  if (path.startsWith('form')) {
    render(watchedState);
  }
});

export { watchedState };
