// imported modules
const url = require("url");
const http = require("http");
const fs = require("fs");
const bodyParser = require('body-parser');

const Game = require('./gameLogic/game.js');

const hostname = "127.0.0.1";
const port = 3000;

// create a game object
var game = new Game();
    
const server = http.createServer((req, res) => {
    // parse the request url
    var urlObj = url.parse(req.url, true);
    console.log(urlObj);

    // using GET requests
    if (req.method == "GET"){
        // request to access page, return start page html
        if (urlObj.pathname == "/"){
            // read the file content from file system
            fs.readFile("game.html", function (err, data) {
               if (err) {
                  console.log(err);
                  res.writeHead(404, {"Content-Type": "text/html"});
               }
               else {	
                  res.writeHead(200, {"Content-Type": "text/html"});	
                  // write the content of the file to response body
                  res.write(data);		
               }
               res.end();
            });  
        }
        // request to check 2 cards, return results of check as JSON
        else if (urlObj.pathname == "/getResult"){
            var x1 = parseInt(urlObj.query.x1);
            var y1 = parseInt(urlObj.query.y1);
            var x2 = parseInt(urlObj.query.x2);
            var y2 = parseInt(urlObj.query.y2);
            var resultJSON = game.chooseTwo(x1, y1, x2, y2);
            
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(resultJSON);
           
            console.log(resultJSON); 
            console.log(game.deck.printCardDeck());
        }
        // requests for .js, .css, .html (non-root)
        else{
            var contentType;
            if (urlObj.pathname.includes(".js")){
                contentType = "text/javascript";
            }
            else if (urlObj.pathname.includes(".css")){
                contentType = "text/css";
            }
            else if (urlObj.pathname.includes(".png")){
                contentType = "img/png";
            }
            else {
                contentType = "text/html";
            }
            // read the file content from file system
            fs.readFile(urlObj.pathname.substr(1), function (err, data) {
               if (err) {
                  console.log(err);
                  res.writeHead(404, {"Content-Type": "text/html"});
               }
               else {	
                  res.writeHead(200, {"Content-Type": contentType});	
                  // write the content of the file to response body
                  res.write(data);		
               }
               // send the response body 
               res.end();
            }); 
        }     
    }
    // post request to start game
    else if (req.method == "POST"){
        // request to start new game, create a new game
        if (urlObj.pathname == "/startGame"){
            var body = [];
            req.on('error', (err) => {
              console.error(err);
            }).on('data', (chunk) => {
              body.push(chunk);
            }).on('end', () => {
              body = JSON.parse(Buffer.concat(body).toString());
              // At this point, we have the headers, method, url and body, and can now
              // do whatever we need to in order to respond to this request.
            
              var n = body.n;
              var deckJSON = game.startNew(n);

              if (deckJSON == {}) {
                 console.log(err);
                 res.writeHead(404, {"Content-Type": "text/html"});
              }
              else{ 
                 res.writeHead(200, {"Content-Type": "text/html"});   
              }
              res.end();
              
              //console.log(deckJSON);
              console.log(game.deck.printCardDeck());
            });
        }
    }
    else {
        console.log("Unexpected request type: " + req.method);
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

