const port = process.env.PORT || 8888;

const express = require('express');
const compression = require('compression');
const minify = require('express-minify');
var app = express();

const db = require('./utils/database');

const {resizingMiddleware} = require('./utils/resizeMiddleware');
const {setCache} = require('./utils/cache');

app.enable('trust proxy');

const shouldCompress = (req, res) => {
  if (req.headers['x-no-compression']) {
    // Will not compress responses, if this header is present
    return false;
  }
  // Resort to standard compression
  return compression.filter(req, res);
};

// Compress all HTTP responses
app.use(compression({
  filter: shouldCompress,
}));

app.use(setCache);

/*app.use(minify({
  cache: "cache/",
  uglifyJsModule: null,
  errorHandler: null,
  jsMatch: /.*\.js/,
  cssMatch: /.*\.css/,
  jsonMatch: /.*\.json/,
  sassMatch: /.*\.scss/,
  lessMatch: /.*\.less/,
  stylusMatch: /.*\.stylus/,
  coffeeScriptMatch: /.*\.coffeescript/,
}));
*/
app.use(minify({
  cache: false,
  uglifyJsModule: require('uglify-js'),
  jsMatch: /javascript/,
  cssMatch: /css/,
  jsonMatch: /json/,
  sassMatch: /scss/,
  lessMatch: /less/,
  stylusMatch: /stylus/,
  coffeeScriptMatch: /coffeescript/,
}));

app.use(function(request, response, next) {

  if (process.env.NODE_ENV != 'development' && !request.secure) {
     return response.redirect("https://" + request.headers.host + request.url);
  }

  next();
});

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(/.*\.(jpe?g|png)/, resizingMiddleware); // If resizing is needed

app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));
app.use('/bootstrap-icons', express.static('node_modules/bootstrap-icons'));
app.use('/theme', express.static('eduport.webestica.com/assets'));
app.use('/static', express.static('public'));

// index page
app.get('/', async function(req, res) {
  res.render('pages/index', {
    page_title: "Homepage / Headstarter",
    jobs: await db.jobs.find().map((job) => {
      return {
        '_id': job._id,
        'name': job.name,
        'category': 'Category',
        'level': 'Level required'
      };
    }).toArray()
  });
});

// about page
app.get('/about', function(req, res) {
  res.render('pages/about', {
    page_title: "About us / Headstarter"
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});