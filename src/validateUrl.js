import { object, string } from 'yup';

const urlSchema = object({
  url: string().url().required(),
});

const validateUrl = (url, state) =>
  new Promise((resolve, reject) => {
    const isDuplicate = state.form.feeds.includes(url);

    if (isDuplicate) {
      reject(new Error('URL уже существует в списке фидов'));
    } else {
      urlSchema
        .validate({ url })
        .then(() => {
          resolve('Success!');
        })
        .catch((e) => {
          reject(new Error(e.message));
        });
    }
  });

export { validateUrl };
