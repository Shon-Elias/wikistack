var chai = require('chai')
var spies = require('chai-spies');
var expect = chai.expect;

chai.use(spies);

describe('2+2', function(){
  it('should be equal to 4', function(){
    expect(2+2).to.equal(4);
  });



});


describe('Set timeout', function(){
   var start;
   var finished;
   before(function(done) {
     start = Date.now();
     setTimeout(function(){
       finished = Date.now() - start;
       done();
     }, 1000)
   })

    it('should last 1000ms', function(){
      expect(finished).to.be.closeTo(1000, 10);
    })

})

describe('forEach', function(){
  it('should call the function for each element in the array', function(){
    var doNothing = chai.spy(function () {})
    var arr = [1,2,3,4];
    arr.forEach(doNothing);
    expect(doNothing).to.have.been.called.exactly(4);
  })
})



