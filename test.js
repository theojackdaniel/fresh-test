const should = require("should");
const request = require("request");
const portfinder = require("portfinder");

var http = require('http');
var server = require("./server.js");
var os = require("os");



describe("Start server", function() {
  let port;
  before(function(done) {
    portfinder.getPort(function(err, portReply) {
      should.not.exist(err);
      port = portReply;
      done();
    });
    
  });

  after(function() {
		server.close();
	});


  it('should start server and response to requests with the content "hello world"',
     function(done){
      server.listen(8080);
      http.get('http://localhost:' + 8080, function(response) {
        console.log(`Testing status code equal 200`);        
        (response.statusCode).should.equal(200);
        var body = '';
				response.on('data', function(d) {
					body += d;
        });
        console.log(`Testing body is hello world`);                
				response.on('end', function() {
				(body).should.equal(`Hello, World!\nHostname: ${os.hostname()}\n`);
        });
        done();
      });
    //this.slow("1s");
   
  });
});