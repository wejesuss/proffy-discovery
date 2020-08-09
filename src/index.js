const express = require('express');
const nunjucks = require('nunjucks');

const {
  index, giveClasses, study, createClasses,
} = require('./pages');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
nunjucks.configure('src/views', {
  express: app,
  autoescape: false,
  noCache: true,
});

app.get('/', index);

app.get('/study', study);

app.get('/give-classes', giveClasses);

app.post('/give-classes', createClasses);

app.listen(5000);
