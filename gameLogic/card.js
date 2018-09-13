// CLASS: representing a card
class Card {
    // construct a particular card
    constructor(number, suit){
        this.number = number;
        this.suit = suit;
        this._isFaceUp = false;        
    }

    // isFaceUp getter
    get isFaceUp(){
        return this._isFaceUp;
    }

    // isFaceUp setter
    set isFaceUp(state){
        if(typeof(state) == "boolean"){
            this._isFaceUp = state;
        }
        else{
            console.log("Trying to set isFaceUp with type: " + typeOf(state));
        }
    }
    
    // function to compare if 2 cards are the same
    isSameCard(card){
        if(this.number == card.number && this.suit == card.suit){
            return true;
        }
        return false;
    }
    
    // utility to print card info as string
    cardToString(){
        return this.number + " of " + this.suit + " (" + this._isFaceUp + ")";
    }
}

module.exports = Card;
