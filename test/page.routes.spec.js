var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);
var Page = require('../models').Page;

describe('GET /wiki', function () {
  beforeEach(function(){
    return Page.sync({force: true})
  })
  it('gets 302 on index', function (done) {
    agent
    .get('/wiki')
    .expect(302, done)
  });
});

describe('GET /wiki/add', function () {
  it('gets 200 on add page', function (done) {
    agent
    .get('/wiki/add')
    .expect(200, done)
  });
});

describe('GET /wiki/:title', function () {
  beforeEach(function(){
    return Page.create({
      title: 'Hello',
      content: 'bye'
    });
  })
  it('gets 200 on title if page exist', function (done) {
    agent
    .get('/wiki/Hello')
    .expect(200, done)
  });
   it('gets 404 on title if page doesnt exist', function (done) {
    agent
    .get('/wiki/Hell')
    .expect(404, done)
  });
});

describe('GET /wiki/:title/similar', function () {
  beforeEach(function(){
    return Page.create({
      title: 'Hello',
      content: 'bye'
    });
  })
  it('gets 200 on title if page exist', function (done) {
    agent
    .get('/wiki/Hello/similar')
    .expect(200, done)
  });
   it('gets 404 on title if page doesnt exist', function (done) {
    agent
    .get('/wiki/Hell/similar')
    .expect(404, done)
  });
});

describe('POST /wiki', function(){
  beforeEach(function(){
    agent
    .post('/some/route')
    .send({
      title: 'Hello',
      content: 'bye',
      name: 'Guille',
      email: 'guille@gg.com',
      tags: []
    });
  })
  it('should create a new Page', function(){

  }
})
