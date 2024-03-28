import { object, string } from 'yup';

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

const urlSchema = object({
  url: string().url().required(),
});

const validateUrl = (url, state) =>
  new Promise((resolve, reject) => {
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
        reject(new Error(e.message));
      });
  });

export { validateUrl };
