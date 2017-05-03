const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const nunjucks = require('nunjucks');
const {db, Page, User} = require('./models');
const routes = require('./routes');

app.use(morgan('dev'));

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// templating boilerplate setup
app.engine('html', nunjucks.render); // how to render html templates
app.set('view engine', 'html'); // what file extension do our templates have
var env = nunjucks.configure('views', { noCache: true });

var AutoEscapeExtension = require("nunjucks-autoescape")(nunjucks);
env.addExtension('AutoEscapeExtension', new AutoEscapeExtension(env));


app.use('/', routes);


app.use('/', function(err, req, res, next){
  res.status(404).send(err);
});


// 1. .sync is an asynchronous operation (it is interacting with the database) and returns a promise.
// 2. this is for dev environments only; in production we will not be resetting our database frequently.


// db.sybc({ force: true })  in order for Sequelize to drop previous tables created and create new ones with this updated structure. Keep in mind that dropping tables means the data in those tables will also be lost.
db.sync()
.then(function(){
  app.listen(1337, function(){
    console.log('Your listen to 1337');
  });
})
.catch(function(err){
  throw err;
});

module.exports = app;






