import { watchedState } from "./state.js";
import { validateUrl } from "./validateUrl.js";

export default () => {
  watchedState.form.url = "";
  watchedState.form.valid = true;
  watchedState.form.error = null;

  const elements = {
    form: document.querySelector(".rss-form"),
    input: document.querySelector("#url-input"),
    button: document.querySelector('[type="submit"]'),
  };

  elements.form.addEventListener("submit", (e) => {
    e.preventDefault();
    const url = elements.input.value;

    validateUrl(url, watchedState)
      .then(() => {
        watchedState.form.valid = true;
        watchedState.form.error = null;
        watchedState.form.feeds.push(url);
        console.log("Форма валидна, отправка данных", url);
        console.log(watchedState);
        elements.form.reset();
        elements.input.focus();
      })
      .catch((error) => {
        watchedState.form.valid = false;
        watchedState.form.errors.push("Ссылка должна быть валидным URL");
        console.error("Ошибка валидации:", error.message);
        console.log(watchedState);
      });
  });

  elements.input.addEventListener("input", (e) => {
    watchedState.form.url = e.target.value;
  });
};
