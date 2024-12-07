
exports.post = async function (options) {
  const { html, selector, type, quality } = options;

  const data = {
    html: html,
    selector: selector,
    image: {
      type: type || 'jpeg',
      quality: quality || 100,
    }
  }

  const response = await fetch('http://localhost:8008/htmltoimg', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const image = await response.json();

  const buffer = new Buffer.from(Object.values(image.image));

  return buffer;

}