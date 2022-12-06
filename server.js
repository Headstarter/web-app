const port = process.env.PORT || 8888;

const express = require('express');
var app = express();

app.enable('trust proxy');
app.use(function(request, response, next) {

  if (process.env.NODE_ENV != 'development' && !request.secure) {
     return response.redirect("https://" + request.headers.host + request.url);
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