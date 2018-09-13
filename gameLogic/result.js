// CLASS: object containing results to send back to client
class Result {
    constructor(isMatch, isWin, card1, card2){
        this.isMatch = isMatch;
        this.isWin = isWin;
        this.card1 = card1;
        this.card2 = card2;
    }
}

module.exports = Result;
