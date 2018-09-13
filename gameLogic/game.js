const Deck = require('./deck.js');
const Result = require('./result.js');

// CLASS: object representing a game session
class Game {
    // starting a game
    constructor(){
        this.deck = new Deck();
        this.result = new Result(false, false, null, null);
    }
    
    // starting a game (return new deck info as JSON)
    startNew(n) {
        this.deck.createDeck(n);
        return JSON.stringify(this.deck.getCardDeck());
    }
    
    // checking if 2 cards are the same and if game is won
    chooseTwo(x1, y1, x2, y2){
        // get the two Card objects
        var card1 = this.deck.getCard(x1, y1);
        var card2 = this.deck.getCard(x2, y2);
        
        // check match and win status
        var checkIsMatch = card1.isSameCard(card2);
        if (checkIsMatch){
            this.deck.flipCards(x1, y1, x2, y2);    // set _isFaceUp as true
        }
        var checkIsWin = this.deck.isWin();
        
        // set results
        this.result.isMatch = checkIsMatch;
        this.result.isWin = checkIsWin;
        this.result.card1 = card1;
        this.result.card2 = card2;
        return JSON.stringify(this.result);
    }
}

module.exports = Game;
