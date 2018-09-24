"use strict";

const FACE_DOWN_IMAGE = "face_down.jpeg";

// helper to build image filename based on card number, suit
function buildImageName(number, suit){
    var fileName;
    switch(number){
        case 1:
            fileName = "ace_of_" + suit;
            break;
        case 11:
            fileName = "jack_of_" + suit;
            break;
        case 12:
            fileName = "queen_of_" + suit;
            break;
        case 13:
            fileName = "king_of_" + suit;
            break;   
        default:
            fileName = number + "_of_" + suit;                     
    }
    return fileName + ".png";
}

// wait till document ready 
$(document).ready(function(){

    // event that start game button is pressed
    $("#startBtn").on("click", function() {
	    var n = $('#boardSizeValue').val();
	    
	    // empty game area
	    $("#gameArea").empty();
	    
	    // send ajax GET request to start the game
	    $.post("/startGame", JSON.stringify({"n" : n}), function(data){
            var imgDiv = "";
            var items = [];
            var imgId = "";
            
            // generate grid of face down cards
            for (let i = 0; i < n; i++){
                for (let j = 0; j < n; j++){
                   // create unique id for image based on poistion
                   imgId = `r${i}c${j}`;
                   items.push('<img src="/images/' + FACE_DOWN_IMAGE + 
                                '" class="unmatched" id="' + imgId + '">'); 
                }
                // add to div
                imgDiv = '<div class="cardRow">' + items.join("") + "</div>";
                $("#gameArea").append(imgDiv);
                imgDiv = "";
                items = [];
            }
	    });
    });
    
    // persistent variables
    var cardNum = 0;
    var cardsObj = {
                    "x1":"-1",
                    "y1":"-1",
                    "x2":"-1",
                    "y2":"-1",
                    };
    // event that a card is clicked
    $("#gameArea").on("click", "img", function(){
        // get the row and col number from id
        var xyArr = $(this).attr("id").split(/[rc]+/);
        
        // run if the card is not already faceup or already chosen as card1
        if ($(this).attr("class") == "unmatched" && 
            !(xyArr[1] == cardsObj.x1 && xyArr[2] == cardsObj.y1)){
            cardNum += 1;
            
            // if this is the first card flipped
            if (cardNum == 1){
                // set coordinates for card1
                cardsObj.x1 = xyArr[1];
                cardsObj.y1 = xyArr[2];
                
                // change class to "selected"
                $(this).attr("class", "selected");
            }
            
            // else this is the second card flipped
            else {
                // set coordinates for card2
                cardsObj.x2 = xyArr[1];
                cardsObj.y2 = xyArr[2];
                
                // change class to "selected"
                $(this).attr("class", "selected");
                
                // send ajax GET request to check if cards match
                $.getJSON("/getResult", cardsObj, function(data){
                    // display the cards faceup
                    var card1Id = "#r" + cardsObj.x1 + "c" + cardsObj.y1;
                    var card2Id = "#r" + cardsObj.x2 + "c" + cardsObj.y2;
                    $(card1Id).attr("src", "/images/" + 
                                    buildImageName(data.card1.number, data.card1.suit));
                    $(card2Id).attr("src", "/images/" + 
                                    buildImageName(data.card2.number, data.card2.suit));
                    
                    console.log(data.isMatch);  // TEST
                    console.log(data.isWin);
                                            
                    // if cards do not match,
                    if (!data.isMatch){
                        // set class back to "unmatched"
                        $(card1Id).attr("class", "unmatched");
                        $(card2Id).attr("class", "unmatched");
                        // wait a while and flip them face down
                        setTimeout(function() {
                            $(card1Id).attr("src", "/images/" + FACE_DOWN_IMAGE);
                            $(card2Id).attr("src", "/images/" + FACE_DOWN_IMAGE);
                        }, 2000);
                    }
                    // if match
                    else{
                        // set class for image to "matched"
                        $(card1Id).attr("class", "matched");
                        $(card2Id).attr("class", "matched");
                        // display an alert if the game is won
                        if (data.isWin){
                            alert("You Won!");
                        }
                    }
                });
                // reset card count and selector array
                cardNum = 0;
            }               
        }
    });
}); 
