const express = require('express');
const router = express.Router();
const userRoute = require('./user');
const wikiRoute = require('./wiki');
const Page = require('../models').Page;



router.use('/wiki', wikiRoute);
router.use('/user', userRoute);

router.get('/', (req, res, next)=>{
  // res.render('index');
  Page.findAll({
    attributes: ['title', 'urlTitle']
  })
  .then(function(result){
    console.log('hey', result);
    res.render('index', {pages: result});
  })
  .catch(next);

});

router.get('/search', function(req, res) {
  const tags = req.query.tags.split(' ');
  Page.findByTag(tags)
  .then(function(pages){
    res.render('searchResults', { pages, query: req.query.tags })
  })
})




module.exports = router;



