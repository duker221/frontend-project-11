export const render = (state) => {
  const form = document.querySelector(".rss-form");
  const input = document.querySelector("#url-input");
  const feedback = document.querySelector(".feedback");
  const submitButton = document.querySelector('button[type="submit"]');

  if (state.form.valid) {
    input.classList.remove("is-invalid");
    feedback.textContent = "";
  } else {
    input.classList.add("is-invalid");
    feedback.textContent = state.form.error;
  }
};
