/**
 * Copyright 2017 The Kubernetes Authors All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const http = require("http");
const os = require("os");

//looking for a port set in PORT environnemnt, if none then set to 8080
const port = process.env.PORT || 8080;

//SIGINT signal is sent with CTRL+C
process.on("SIGINT", function() {
  console.log("shutting down...");
  process.exit(1);
});

var handleRequest = function(request, response) {
  console.log(`Received request for URL: ${request.url}`);
  response.writeHead(200);
  response.end(`Hello, World!\nHostname: ${os.hostname()}\n`);
};

// first create a server able to handle requests, then listen on port to launch it
var www = http.createServer(handleRequest);

// start the server on the given port.
exports.listen = function(port) {
	console.log(`server listening on port ${port}`);
	server.listen(port);
};

// destroys the server.
exports.close = function() {
	server.close();
};


www.listen(port, () => {
  console.log(`server listening on port ${port}`);
});

module.exports = www;