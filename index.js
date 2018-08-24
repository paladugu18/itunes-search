const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const path = require('path');
const construx = require('construx');
const bourbon = require('bourbon');
const neat = require('bourbon-neat');

const baseRoute = require('./controllers/routes/home');
const iTunesRoute = require('./controllers/routes/itunes');

const app = express();

app.set('views', path.resolve(__dirname, 'views'));
app.engine('hbs', handlebars({
  defaultLayout: 'base',
  extname: 'hbs',
}));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(bodyParser.json());

// Static Resources
app.use(express.static(path.join(__dirname, 'public')));

app.use(construx('assets', 'public', {
  sass: {
    module: 'construx-sass',
    files: '/styles/**/*.css',
    ext: 'scss',
    paths: [bourbon.includePaths, neat.includePaths],
  },
}));

// Routes
app.use('/', baseRoute);
app.use('/searchitunes', iTunesRoute);

// Handle 404
app.use((req, res) => {
  res.status(404).send('Uh oh!(404 Error)');
});

module.exports = app;
