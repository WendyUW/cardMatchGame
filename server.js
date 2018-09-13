// imported modules
const url = require("url");
const http = require("http");
const fs = require("fs");

const Game = require('./gameLogic/game.js');

const hostname = "127.0.0.1";
const port = 3000;

// create a game object
var game = new Game();
    
const server = http.createServer((req, res) => {
    // using GET for starting game
    if (req.method == "GET"){
        // parse the request url
        var urlObj = url.parse(req.url, true);
        console.log(urlObj);
        
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
        // request to start new game, create a new game
        else if (urlObj.pathname == "/start"){
            var n = parseInt(urlObj.query.n);
            var deckJSON = game.startNew(n);
            
            //res.writeHead(200, {"Content-Type": "application/json"});
            //res.end(deckJSON);

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
            
        }
        // request to check 2 cards, return results of check as JSON
        else if (urlObj.pathname == "/checkMatch"){
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
               }else {	
                  res.writeHead(200, {"Content-Type": contentType});	
                  // write the content of the file to response body
                  res.write(data);		
               }
               // send the response body 
               res.end();
            }); 
        }     
    }
    else {
        console.log("Unexpected request type: " + req.method);
    }

    //res.statusCode = 200;
    //res.setHeader('Content-Type', 'text/plain');
    //res.end('Hello World\n');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

