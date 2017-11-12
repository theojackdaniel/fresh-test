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
      server.listen(port);
      http.get('http://localhost:' + port, function(response) {
				(response.statusCode).should.equal(201);
        var body = '';
        // for some reason it doesn't always execute the code below?
        console.log(`server listening on port ${port}`);
        
				response.on('data', function(d) {
					body += d;
				});
				response.on('end', function() {
				(body).should.equal(`Hello, World!\nHostname: ${os.hostname()}\n`);
				});
			});

    this.slow("1s");
    done();
  });
});