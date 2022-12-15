const sharp = require('sharp');
const Path = require('path');
const mime = require('mime-types');

function resizeImage(path, width, height) {
  return sharp(path)
    .resize({
      width,
      height,
      // Preserve aspect ratio, while ensuring dimensions are <= to those specified
      fit: sharp.fit.fill,
    })
    .toBuffer();
}

function limitNumberToRange(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

function parseResizingURI(uri) {
  // Attempt to extract some variables using Regex
  const matches = uri.match(
    /static\/(?<path>.*\/)(?<name>[^\/]+)(?<extension>\.[a-z\d]+)\?(?<width>\d+)x(?<height>\d+)$/i
  );

  if (matches) {
    const { path, name, width, height, extension } = matches.groups;
    console.log(path + name + extension, limitNumberToRange(+width, 0, 2000), limitNumberToRange(+height, 0, 2000));
    return {
      path: path + name + extension, // Original file path
      width: limitNumberToRange(+width, 0, 2000), // Ensure the size is in a range
      height: limitNumberToRange(+height, 0, 2000), // so people don't try 999999999
      extension: extension,
    };
  }
  return false;
}

function resizingMiddleware(req, res, next) {
  console.log(req.uri, req.url, req.baseUrl, req.originalUrl);
  const data = parseResizingURI(req.originalUrl); // Extract data from the URI

  if (!data) {
    return next();
  } // Could not parse the URI

  // Get full file path in public directory
  const path = Path.join(__dirname, "../public", data.path);
  console.log(path);
  resizeImage(path, data.width, data.height)
    .then((buffer) => {
      // Success. Send the image
      res.set("Content-type", mime.lookup(path)); // using 'mime-types' package
      res.send(buffer);
    })
    .catch(next); // File not found or resizing failed
}

module.exports = {
  resizingMiddleware: resizingMiddleware,
};
