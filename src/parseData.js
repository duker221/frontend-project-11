/* eslint-disable import/prefer-default-export */
const parseData = (data) => {
  const parser = new DOMParser();

  const parsedData = parser.parseFromString(data, 'text/xml');

  const errors = parsedData.querySelector('parsererror');
  if (errors) {
    throw new Error(`Parse Error: ${errors.textContent}`);
  }

  const feed = {
    title: parsedData.querySelector('title').textContent,
    description: parsedData.querySelector('description').textContent,
  };
  const posts = Array.from(parsedData.querySelectorAll('item')).map((el) => ({
    title: el.querySelector('title').textContent,
    description: el.querySelector('description').textContent,
    link: el.querySelector('link').textContent,
  }));

  return {
    feed,
    posts,
  };
};

export { parseData };
