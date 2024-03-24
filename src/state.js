import onChange from 'on-change';
import { renderErrors } from './view.js';

const state = {
  form: {
    url: '',
    valid: true,
    feeds: [],
    errors: [],
  },
};

const watchedState = onChange(state, (path, value, previousValue) => {
  if (path === 'form') {
    renderErrors(watchedState);
  }
  if (path === 'form.errors') {
    renderErrors(watchedState);
  }
});

export { watchedState };
