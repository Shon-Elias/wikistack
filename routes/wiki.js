
const express = require('express');
const router = express.Router();
const Page = require('../models').Page;
const User = require('../models').User;


router.get('/', function(req,res){

  res.redirect('/');
});


router.post('/', (req, res, next) =>{

  User.findOrCreate({
    where:{
      name: req.body.name,
      email: req.body.email
    }

  })
  .then(function(users){
    const newPage = Page.build({
      title: req.body.title,
      content: req.body.content,
      tags: req.body.tags.split(', ')
    })

    return newPage.save()
           .then(function(newPage){
           return newPage.setAuthor(users[0]);
     })

  })
  .then (function(result){
    // Move to the current page we just saved
    res.redirect(result.route);
  })
  .catch(function(err){
    next(err);
  });

});



router.get('/add', (req, res)=>{
  res.render('addpage');
});

router.get('/:title', function(req, res, next){
  Page.findOne({
    where: {
      urlTitle: req.params.title
    }
  })
  .then(function (page){
    return page.getAuthor().then(function(user){
      res.render('wikipage', {page, user});
    })
  }).catch(next)


});
router.get('/:title/similar', function(req, res, next){
  Page.findOne({
    where: {
      urlTitle: req.params.title
    }
  })
  .then(function(page){
    console.log(page)
   return page.findSimilar()
  })
  .then(function(pages){
    console.log(pages)
    res.render('index', { pages })
  })
  .catch(next)
})




module.exports = router;
