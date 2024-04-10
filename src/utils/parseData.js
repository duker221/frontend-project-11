const parseData = (data) => {
  const parser = new DOMParser();

  const parsedData = parser.parseFromString(data, 'text/xml');

  const errors = parseData.querySelector('parsererror');
  if (errors) {
    throw new Error(`Parse Error: ${errors.textContent}`);
  }

  return parsedData;
};

export default parseData;
