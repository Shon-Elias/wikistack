const express = require('express');
const router = express.Router();
const { User, Page } = require('../models');
var Promise = require('sequelize').Promise;

router.get('/', function(req, res, next){
  User.findAll()
  .then(function(users){
    res.render('users', { users });
  })
  .catch(next)
});


router.get('/:id', function(req, res, next){
  const userPromise = User.findOne({
    where: {
      id: req.params.id
    }
  })
  const pagesPromise = Page.findAll({
    where: {
      authorId: req.params.id
    }
  })
  Promise.all([userPromise, pagesPromise])
  .then(function(results){
    const user = results[0]
    const pages = results[1]
    res.render('profile', { user, pages });
  })
  .catch(next)
})

module.exports = router;
