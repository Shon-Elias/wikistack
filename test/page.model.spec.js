var expect = require('chai').expect;
var Page = require('../models').Page;


describe('Page Model', function(){
  beforeEach(function() {
   return Page.sync({force: true});
  })

  describe('Virtuals', function(){

    beforeEach(function() {
      return Page.create({
        title: 'Hello World',
        content: 'content is here'
      })
    })

  describe('route', function(){
    it('Should create the proper route',function(){
        return Page.findOne({
          where: {
            title: 'Hello World'
          }
        })
        .then(function(page) {
          expect(page.route).to.equal('/wiki/Hello_World');
        })
      })
    })

    describe('renderedContent', function(){
      it('should render the content into HTML', function(){
        return Page.findOne({
          where: {
            title: 'Hello World'
            }
          })
          .then(function(page){
            expect(page.renderedContent).to.equal('<p>content is here</p>\n');
          })
      })
    })
  })

  describe('Static - Class Methods', function() {
    beforeEach(function() {
      return Page.create({
        title: 'Hello World',
        content: 'content is here',
        tags: ['hello', 'YOLO', 'World', 'Academy']
      })
      .then(function(){
        return Page.create({
          title: 'Goodbye World',
          content: 'content is here',
          tags: ['Goodbye', 'LOL', 'Fullstack', 'YOLO']
        })
      })
    })
    describe('findByTag', function() {
      it('should find one page for one tag', function(){
        return Page.findByTag(['Goodbye'])
        .then(function(pages){
          expect(pages[0].title).to.equal('Goodbye World');
        })
      })
      it('should find one page for multiple tags', function(){
        return Page.findByTag(['Goodbye', 'Nothing'])
        .then(function(pages){
          expect(pages[0].title).to.equal('Goodbye World');
        })
      })
      it('should find multiple pages for one tag', function(){
        return Page.findByTag(['YOLO'])
        .then(function(pages){
          expect(pages).to.have.length.of(2);
        })
      })
      it('should find no pages for no coincidence tag', function(){
        return Page.findByTag(['Nothing'])
        .then(function(pages){
          expect(pages).to.have.length.of(0);
        })
      })
      it('should find multiple pages for multiple tags', function(){
        return Page.findByTag(['hello', 'Goodbye'])
        .then(function(pages){
          expect(pages).to.have.length.of(2);
        })
      })
    })
  })

  describe('Instance Method', function(){
    beforeEach(function(){
      return Page.bulkCreate([
        {
          title: 'Hello',
          content: 'Hello',
          tags: ['Hello', 'LOL'],
          urlTitle: 'Hello'
        },
        {
          title: 'Bye',
          content: 'Bye',
          tags: ['Bye'],
          urlTitle: 'Bye'

        },
        {
           title: 'Hello2',
          content: 'Hello2',
          tags: ['Hello'],
          urlTitle: 'Hello2'
        }
      ])
    })

    it("should not find pages if it doesn't have similar tags", function(){
      return Page.findOne({
        where: {
          title: 'Bye'
        }
      })
      .then(function(page){
        return page.findSimilar()
      })
      .then(function(similarPages){
        expect(similarPages).to.have.length.of(0);
      })
    })

    it("should find pages if it has similar tags", function(){
      return Page.findOne({
        where: {
          title: 'Hello'
        }
      })
      .then(function(page){
        return page.findSimilar()
      })
      .then(function(similarPages){
        expect(similarPages).to.have.length.of(1);
        expect(similarPages[0].title).to.equal('Hello2')
      })
    })

  })

  describe('Validators', function(){

    describe('Title', function(){
      it('Should throw an error if not a String', function(){
        var page = Page.build({
          title: [],
          content: 'Hello2',
          urlTitle: 'hello'
        })
        return page.validate()
        .then(function(error){
          expect(error.message).to.be.equal('string violation: title cannot be an array or an object');
        })
      })
        it('Should throw an error if no title defined', function(){
        var page = Page.build({
          title: null,
          content: 'Hello2',
          urlTitle: 'hello'
        })
        return page.validate()
        .then(function(error){
          expect(error.message).to.be.equal('notNull Violation: title cannot be null');
        })
      })
        it('Shouldn\'t throw an error if it is a String', function(){
        var page = Page.build({
          title: 'hello',
          content: 'Hello2',
          urlTitle: 'hello'
        })
        return page.validate()
        .then(function(error){
          expect(error).to.be.equal(null);
        })
      })
    })
    describe('urlTitle', function(){
      it('Should throw an error if not a String', function(){
        var page = Page.build({
          title: 'hello',
          content: 'Hello2',
          urlTitle: []
        })
        return page.validate()
        .then(function(error){
          expect(error.message).to.be.equal('string violation: urlTitle cannot be an array or an object');
        })
      })
        it('Should throw an error if no urlTitle defined', function(){
        var page = Page.build({
          title: 'hello',
          content: 'hello'
        })
        return page.validate()
        .then(function(error){
          expect(error.message).to.be.equal('notNull Violation: urlTitle cannot be null');
        })
      })
        it('Shouldn\'t throw an error if it is a String', function(){
        var page = Page.build({
          title: 'hello',
          content: 'Hello2',
          urlTitle: 'hello'
        })
        return page.validate()
        .then(function(error){
          expect(error).to.be.equal(null);
        })
      })
    })
    describe('content', function(){
      it('Should throw an error if not a String', function(){
        var page = Page.build({
          title: 'hello',
          content: [],
          urlTitle: 'hello'
        })
        return page.validate()
        .then(function(error){
          expect(error.message).to.be.equal('string violation: content cannot be an array or an object');
        })
      })
        it('Should throw an error if no content defined', function(){
        var page = Page.build({
          title: 'hello',
          urlTitle: 'hello',
        })
        return page.validate()
        .then(function(error){
          expect(error.message).to.be.equal('notNull Violation: content cannot be null');
        })
      })
        it('Shouldn\'t throw an error if it is a String', function(){
        var page = Page.build({
          title: 'hello',
          content: 'Hello2',
          urlTitle: 'hello'
        })
        return page.validate()
        .then(function(error){
          expect(error).to.be.equal(null);
        })
      })
    })

     describe('status', function(){
      it('Should throw an error if not a valid value', function(){
        var page = Page.build({
          title: 'hello',
          content: 'hello',
          urlTitle: 'hello',
          status: 'hello'
        })
        return page.validate()
        .then(function(error){
          expect(error.message).to.be.equal('Validation error: Validation isIn failed');
        })
      })
        it('Shouldn\'t throw an error if it is a valid value', function(){
        var page = Page.build({
          title: 'hello',
          content: 'Hello2',
          urlTitle: 'hello',
          status: 'open'
        })
        return page.validate()
        .then(function(error){
          expect(error).to.be.equal(null);
        })
      })
    })
    describe('tags', function(){
      it('Should throw an error if not a valid array', function(){
        var page = Page.build({
          title: 'hello',
          content: 'hello',
          urlTitle: 'hello',
          tags: 'hello'
        })
        return page.validate()
        .then(function(error){
          expect(error.message).to.be.equal('Validation error: arr.forEach is not a function');
        })
      })
       it('Should throw an error if not a valid array of strings', function(){
        var page = Page.build({
          title: 'hello',
          content: 'hello',
          urlTitle: 'hello',
          tags: [[],[]]
        })
        return page.validate()
        .then(function(error){
          expect(error.message).to.be.equal('Validation error: Should be an Array of Strings');
        })
      })
        it('Shouldn\'t throw an error if it is a valid array of strings', function(){
        var page = Page.build({
          title: 'hello',
          content: 'Hello2',
          urlTitle: 'hello',
          tags: ['hello']
        })
        return page.validate()
        .then(function(error){
          expect(error).to.be.equal(null);
        })
      })
    })
  })
  describe('Hooks', function() {
    describe('UrlTitle', function(){
      it('should create a proper urlTitle after validating the page', function(){
        return Page.create({
          title: 'Hello World!',
          content: 'blah blah'
        })
        .then(function(page){
          expect(page.urlTitle).to.exist;
          expect(page.urlTitle).to.equal('Hello_World_');
        })
      })
    })
  })
})
