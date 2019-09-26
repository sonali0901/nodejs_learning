var http = require('http');
const os = require('os');
const fs = require('fs');

var server = http.createServer(function(request, response) {
	console.log(request.url);
	if(request.url === '/home' || request.url ==='/') {
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.end('Hello World');
	}
	else if (request.url === '/api/second') {
		response.writeHead(200, {'Content-Type': 'application/json'});
		var myObj = {
			name: 'Sonali',
			job: 'Ninja'
	};	
	response.end(JSON.stringify(myObj)); //response body
}
	else if (request.url === '/api3') {}
	else {
		response.writeHead(404, {'Content-Type': 'text/html'});
		fs.createReadStream(__dirname+'/404.html').pipe(response);
	}
});

server.listen(9080, '127.0.0.1');
console.log('Listening on port 9080');
//console.log(os.cpus());
