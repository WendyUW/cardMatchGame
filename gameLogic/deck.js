const Card = require('./card.js');

// CLASS: representing a collection of cards
class Deck {
    // populate a randomized cardDeck (n by n array of Card objects)
    constructor(){
        this.numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
        this.numNumbers = this.numbers.length;
        this.suits = ["diamonds", "clubs", "hearts", "spades"];
        this.numSuits = this.suits.length;
        this.cardDeck = [];
    }
    
    createDeck(n) {
        // set new deck dimensions
        this.dim = n;
        
        // clear previous deck
        var cards = [];
        this.cardDeck = [];
        this.numFaceUp = 0;
        
        // randomly add 2 of the same card to the cardDeck array  
        var num = 0;
        var suit = "";
        var card1 = null; 
        var card2 = null;
        var numCardPairs = this.dim * this.dim / 2;
        var numCards = this.dim * this.dim;
        
        for(let i = 0; i < numCardPairs; i++){
            num = this.numbers[Math.floor(Math.random() * this.numNumbers)];
            suit = this.suits[Math.floor(Math.random() * this.numSuits)]
            card1 = new Card(num, suit);
            card2 = new Card(num, suit);
            cards.push(card1, card2); 
        }
        
        // shuffle card positions in the array
        for (let i = numCards - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            var temp = cards[i];
            cards[i] = cards[j];
            cards[j] = temp;
        }
        
        // regroup 1d array into 2d array
        while(cards.length > 0){
            this.cardDeck.push(cards.splice(0, this.dim));
        }
    }
    
    // utility for getting a card object by location
    getCard(x1, y1){
        return this.cardDeck[x1][y1];
    }
    
    // utility for registering a card as face up
    flipCards(x1, y1, x2, y2){
        this.getCard(x1, y1).isFaceUp = true;
        this.getCard(x2, y2).isFaceUp = true;
        this.numFaceUp += 2;
    }
    
    
    // utility for checking if game is won
    isWin(){
        if (this.numFaceUp == this.dim * this.dim){
            return true;
        }
        return false;
    }
    
    // utility to get the cards in the deck only
    getCardDeck(){
        return this.cardDeck;
    }
    
    // utility to print out all card info in current deck
    printCardDeck(){
        for (let i = 0; i < this.dim; i++){
            for (let j = 0; j < this.dim; j++){
                console.log("(" + i + "," + j +") = " + this.getCard(i, j).cardToString());
            }
        }
    }
}

module.exports = Deck;
