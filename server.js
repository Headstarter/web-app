const port = process.env.PORT || 8888;

const express = require('express');
var app = express();

app.enable('trust proxy');
app.use(function(request, response, next) {
  console.log(`Reaching out for ${req.protocol + '://' + req.get('host') + req.originalUrl}`);
  if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
    console.log(`Redirecting to ${'https://' + req.get('host') + req.url}`);
    return res.redirect('https://' + req.get('host') + req.url);
  }
  else {
    console.log("HTTPS approved - asking for router");
  }

  next();
});


// set the view engine to ejs
app.set('view engine', 'ejs');

app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));
app.use('/bootstrap-icons', express.static('node_modules/bootstrap-icons'));
app.use('/theme', express.static('eduport.webestica.com/assets'));
app.use('/static', express.static('public'));

// index page
app.get('/', async function(req, res) {
  res.render('pages/index', {
    page_title: "Очаквайте Headstarter скоро"
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});