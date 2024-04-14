/* eslint-disable import/prefer-default-export */
const parseData = (data) => {
  const parser = new DOMParser();

  const parsedData = parser.parseFromString(data, 'text/xml');

  const errors = parsedData.querySelector('parsererror');
  if (errors) {
    throw new Error(`Parse Error: ${errors.textContent}`);
  }

  return parsedData;
};

export { parseData };
