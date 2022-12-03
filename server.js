const port = process.env.PORT || 8888;

const express = require('express');
var app = express();

const db = require('./utils/database');

// set the view engine to ejs
app.set('view engine', 'ejs');

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