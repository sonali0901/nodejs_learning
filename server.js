(function() {

  var fs, https, mimetypes, options, path, server;

  fs = require("fs"); 
  https = require("https");
  path = require("path");

  mimetypes = {

    "css":"text/css",
    "html":"text/html",
    "ico":"image/ico",
    "jpg":"image/jpeg",
    "js":"text/javascript",
    "json":"application/json",
    "png":"image/png"

  };

  options = {

    pfx: fs.readFileSync("ssl/crt.pfx"),
    passphrase: "password"

  };

  server = https.createServer(options, function(request, response) {

    if (request.url == "" || request.url == "/") {
      request.url = "index.html";

    }

    fs.readFile(__dirname + "/" + request.url, function(error, content) {

      if (error) {
        console.log("Error: " + error); 
      } else { 
        response.writeHead(200, {'Content-Type':mimetypes[path.extname(request.url).split(".")[1]]});
        response.write(content);
      }

      response.end(); 

    });

  });

  server.listen("2468", "192.168.0.101", function() {

    console.log("Server started!");

  }); 

})();

