const parseData = (data) => {
  const parser = new DOMParser();

  const parseData = parser.parseFromString(data, 'text/xml');

  const errors = parseData.querySelector('parsererror');
  if (errors) {
    throw new Error(`Parse Error: ${errors.textContent}`);
  }

  return parseData;
};

export { parseData };
