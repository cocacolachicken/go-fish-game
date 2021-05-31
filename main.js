var playerPoints = [];
var cpuPoints = []; //Computer is shortened to CPU because of super smash bros.
// The computer in this game is named Pochitchi because of my tamagotchi obsession. Not using an image of pochitchi because why not.
// However, I do think that I will name it something else if I do make another difficulty (maybe one with less memory)
// Maybe that plant that i've always hated? I don't know i'm just rambling right now. 
var playerHand = [];
var cpuHand = [];
var deck = [];
var lastCardFail = [];
var cpuMemoryPlayed = []; //Variable was abolished
var currentTurn = -1; //even is the player, odd is pochitchi
var scenario = "";

// Memory of the AI
let cpuMemory = {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: false,
    10: false,
    11: false,
    12: false,
    13: false,
    remember : function (rankValue) {
        this[rankValue] = true; // Remembers a card number. More for readability and less for practicality

    },
    forget : function (rankValue) { //Same with this.
        this[rankValue] = false;
    },
    ifNothing : function () { //This is to get if the cpuMemory is empty or not. 
        let temp = true;
        for (f = 0; f != 14; f++) {
            if (cpuMemory[f]) temp = false;
        }
        return temp;
    },
    clear : function () {
        for (f = 0; f!= 14; f++) {
            this[f] = false;
        }
    }
};

class Events {
    constructor (player, cardIn, result) {
        this.Player = player; //0 represents player, 1 represents Pochitchi
        this.CardIn = cardIn; //The card that was played
        this.CardOut = result; //Can be a pair or void. Pair rep a point taken and void rep a go fish. 
        this.String = this.returnString(); // Aka using the function's return string
    }
    returnString () {
        if (this.Player %2 == 0) {
            this.PlayerName = "Player";
        } else {
            this.PlayerName = "Pochitchi";
        }
        let stringOut = "";
        if (this.CardOut == 0) {
            stringOut = this.PlayerName + " played the " + this.CardIn.rankName() + " of " + this.CardIn.suitName() + ". They went fishing.";
            if (deck.length == 0) {
                stringOut += " But unfortunately for them, overfishing had destroyed the lake.";
            }
        } else {
            stringOut = this.PlayerName + " played the " + this.CardIn.rankName() + " of " + this.CardIn.suitName()
                + ". They got the " + this.CardOut.rankName() + " of " + this.CardOut.suitName() + " in return!";
        }
        return stringOut;
    }
}



//Card class. Basic unit
class Card {
    constructor (suit, rank) {
        this.Suit = suit;
        this.Rank = rank;
        this.CardName = "/cards/";
        this.returnCardName();
    }
    pairCheck (otherCard) {
        if (otherCard.Rank == this.Rank) {
            return 1;
        } else return 0;
    }
    suitName () {
        let stringReturn = "";
        switch (this.Suit) {
            case 0: 
                stringReturn = "Plums";
                break;
            case 1:
                stringReturn = "Apples";
                break;
            case 2:
                stringReturn = "Clovers";
                break;
            case 3:
                stringReturn = "Dandelions";
                break;
        }
        return stringReturn;
    }
    rankName () {
        let stringReturn = "";
        switch (this.Rank) {
            case 1:
                stringReturn = "Ace";
                break;
            case 2:
                stringReturn = "Two";
                break;
            case 3:
                stringReturn = "Three";
                break;
            case 4:
                stringReturn += "Four";
                break;
            case 5:
                stringReturn += "Five";
                break;
            case 6:
                stringReturn += "Six";
                break;
            case 7:
                stringReturn += "Seven";
                break;
            case 8:
                stringReturn += "Eight";
                break;
            case 9:
                stringReturn += "Nine";
                break;
            case 10:
                stringReturn += "Ten";
                break;
            case 11:
                stringReturn += "Jack";
                break;
            case 12:
                stringReturn += "Queen";
                break;
            case 13:
                stringReturn += "King";
                break;
        }
        return stringReturn;
    }
    returnCardName () { //Returns the name of the card, used for images
        switch (this.Rank) {
            case 1:
                this.CardName += "AceOf";
                break;
            case 2:
                this.CardName += "TwoOf";
                break;
            case 3:
                this.CardName += "ThreeOf";
                break;
            case 4:
                this.CardName += "FourOf";
                break;
            case 5:
                this.CardName += "FiveOf";
                break;
            case 6:
                this.CardName += "SixOf";
                break;
            case 7:
                this.CardName += "SevenOf";
                break;
            case 8:
                this.CardName += "EightOf";
                break;
            case 9:
                this.CardName += "NineOf";
                break;
            case 10:
                this.CardName += "TenOf";
                break;
            case 11:
                this.CardName += "JackOf";
                break;
            case 12:
                this.CardName += "QueenOf";
                break;
            case 13:
                this.CardName += "KingOf";
                break;
        }
        switch (this.Suit) {
            case 0: 
                this.CardName += "Plums";
                break;
            case 1:
                this.CardName += "Apples";
                break;
            case 2:
                this.CardName += "Clovers";
                break;
            case 3:
                this.CardName += "Dandelions";
                break;
        }
        this.CardName += ".png";
    }
}

//Pair, used to track a point
class Pair {
    constructor (rank, SuitLeft, SuitRight) {
        this.Rank = rank;
        this.Left = SuitLeft;
        this.Right = SuitRight;
    }
}

//Deck creation
function create () {
    deck.length = 0;
    for (let s = 0; s != 4; s++) {
        for (let r = 1; r != 14; r++) {
            deck.push(new Card(s, r));
        }
    }
    playerPoints.length = 0;
    cpuPoints.length = 0;
    cpuHand.length = 0;
    playerHand.length = 0;
}

function shuffle () {
    //Shuffling algorithm
    for (let i = 51; i != 0; i--) {
        let randomVal = Math.floor(Math.random() * i);
        let temp = deck[randomVal];
        deck[randomVal] = deck[i];
        deck[i] = temp;
    }
    //Just so that cards have a chance of being in the same position they were initially
    for (let i = 51; i != 0; i--) {
        let randomVal = Math.floor(Math.random() * i);
        let temp = deck[randomVal];
        deck[randomVal] = deck[i];
        deck[i] = temp;
    }
}

//Distributing cards (pop works in a similar way to getting the card from the top of the deck.)
function distribute () {
    for (let i = 0; i != 5; i++) {
    playerHand[i] = deck.pop();
    }
    for (let i = 0; i != 5; i++) {
        cpuHand[i] = deck.pop();
    }
}

//Player plays. Reason why i put active and passive is so that i can easily reverse the roles
function turn (cardNumber, activePlayerDeck, passivePlayerDeck, activePoints) {
    //Stores the card being played into active card
    let activeCard = activePlayerDeck[cardNumber];
    let prePoints = activePoints.length;
    //Loops to find a pair
    for (let f = 0; f != passivePlayerDeck.length; f++) {

        let passiveCard = passivePlayerDeck[f];
        let newPair = activeCard.pairCheck(passiveCard);
        if (newPair == 1) {
            // player points ++
            activePoints[activePoints.length] = new Pair (activeCard.Rank, activeCard.Suit, passiveCard.Suit);
            lastPlayed = new Events(currentTurn, activeCard, passiveCard);
            cpuMemory.forget(parseInt(activeCard.Rank));
            activePlayerDeck.splice(cardNumber, 1);
            passivePlayerDeck.splice(f, 1);
            if (activePlayerDeck.length == 0  && deck.length != 0) {
                activePlayerDeck.push(deck.pop());
                if (currentTurn % 2 == 0) {
                    lastPlayed.String += " Player tried to fish, feeling confident.";
                } else {
                    lastPlayed.String += " Pochitchi tried to fish, feeling confident.";
                }
            }
            if (passivePlayerDeck.length == 0 && deck.length != 0) {
                passivePlayerDeck.push(deck.pop());
                if (currentTurn % 2 == 0) {
                    lastPlayed.String += " Pochitchi tried to fish because he had no food.";
                } else {
                    lastPlayed.String += " Player tried to fish because they had no food.";
                }
            }
            return false;
        }
    }
    //Makes it so that the player "fishes" if no points are detected
    if (prePoints == activePoints.length && deck.length != 0) {
        lastPlayed = new Events(currentTurn, activeCard, 0);
        activePlayerDeck.push(deck.pop());
        checkForPairs(activePoints, activePlayerDeck);
        if (activePlayerDeck.length == 0  && deck.length != 0) 
            activePlayerDeck.push(deck.pop());
    }
    return activeCard.Rank;
}

function playerTurn (cIndex) {
    currentTurn ++;
    let cpuAwareness = turn(cIndex, playerHand, cpuHand, playerPoints);
    if (cpuAwareness) {
        cpuMemory.remember(cpuAwareness);
        cpuMemoryPlayed.push(cpuAwareness);
    };
}

function cpuTurn (cIndex) {
    currentTurn ++;
    let tempCardPlayed = cpuHand[cIndex].Rank;
    let cpuPointsBefore = cpuPoints.length;
    turn(cIndex, cpuHand, playerHand, cpuPoints);
    if (cpuPointsBefore == cpuPoints.length) {
        lastCardFail.push(tempCardPlayed);
        cpuMemory.forget(parseInt(tempCardPlayed));
    }
    return tempCardPlayed;
}

//Ai
function cpuMove () {
    //Chooses random card if no memory present
    if (cpuMemory.ifNothing()) {
        let rand = Math.floor(Math.random() * cpuHand.length);
        
        console.log(cpuTurn(rand)); //Console log to know which card the cpu played
    } 
    else { 
        let possiblePairs = [];
        for (let x = 0; x != cpuHand.length; x++) {
            if (cpuMemory[cpuHand[x].suit]) {
                possiblePairs.push(x);
            }
        }
        console.log(possiblePairs);
        if (possiblePairs.length > 0) { //If a rank is detected in possibble pairs, the CPUU will make that move
            console.log(cpuTurn(possiblePairs[Math.floor(Math.random() * possiblePairs.length)]));
            
        } else {
            let rand = Math.floor(Math.random() * cpuHand.length);
            
            console.log(cpuTurn(rand)); //Console log to know which card the cpu played
        }
    }
}

//Checking if there's a double in the hand at the end of turn after fishing
function checkForPairs (activePoints, activePlayerDeck) {
    for (let o = 0; o < activePlayerDeck.length; o++) {
        for (let x = 0; x != activePlayerDeck.length; x++) {
            let loopCondition = false;
            for (let n = x+1; n != activePlayerDeck.length; n++) {
                if (activePlayerDeck[x].Rank == activePlayerDeck[n].Rank) {
                    activePoints[activePoints.length] = new Pair(activePlayerDeck[x].Rank, 
                        activePlayerDeck[x].Suit, activePlayerDeck[n].Suit);
                    lastPlayed.String += " But fortunately for them, they found a pair anyways with the " + 
                    activePlayerDeck[n].rankName() + " of " + activePlayerDeck[n].suitName() + " they caught.";
                    cpuMemory.forget(parseInt(activePlayerDeck[x].Rank));
                    activePlayerDeck.splice(n, 1);
                    activePlayerDeck.splice(x, 1);
                    loopCondition = true;
                    
                    break;
                }
            }
            if (loopCondition) {
                
                break;
            };
        }
    }
}

/*Graphics functions ahead 
  Mostly for displaying hands
  Names reveal the use
*/
function displayHand () {
    document.getElementById("playerHand").innerHTML = "";
    for (let x = 0; x != playerHand.length; x++) {
        document.getElementById("playerHand").innerHTML += `<img id="playerCard${x}" class="card" onClick="playLoop(${x})">`;
        document.getElementById(`playerCard${x}`).src = playerHand[x].CardName;
    }
}

function displayDummyHand () { //Displays a non-functional hand
    document.getElementById("playerHand").innerHTML = "";
    for (let x = 0; x != playerHand.length; x++) {
        document.getElementById("playerHand").innerHTML += `<img id="playerCard${x}" class="card">`;
        document.getElementById(`playerCard${x}`).src = playerHand[x].CardName;
    }
}

function displayCpu () {
    document.getElementById("cpuHand").innerHTML = "";
    for (let x = 0; x != cpuHand.length; x++) {
        document.getElementById("cpuHand").innerHTML += `<img id="cpuCard${x}" class="card">`;
        document.getElementById(`cpuCard${x}`).src = "/cards/BackOfCards.png";
    }
}

function thinking () {
    document.getElementById("feed").innerHTML = "Pochitchi is thinking . . .<br>"; 
}

function notThinking () {
    document.getElementById("feed").innerHTML = "Pochitchi is waiting.<br>";
}

function score () { //Shows the score
    document.getElementById("cpuPoints").innerHTML = cpuPoints.length;
    document.getElementById("playerPoints").innerHTML = playerPoints.length;
}

function cardPlayed () { //Shows the card last played
    document.getElementById("lastPlayed").innerHTML = `<img src=${lastPlayed.CardIn.CardName} id="lastPlayed">`;
}

function updateLog () { //Updates the feed
    document.getElementById("feed").innerHTML += lastPlayed.String;
}

function deckLeft () { //Shows how much of the deck is left
    document.getElementById("cardsLeft").innerHTML = deck.length;
}

function endScreen () { // Shows the end screen
    setTimeout(() => document.getElementById("feed").innerText = "Waiting for results...", 1500);
    setTimeout(() => {
        let winSplash = "";
        if (playerPoints.length > cpuPoints.length) {
            winSplash = "WIN";
        } else if (cpuPoints.length > playerPoints.length) {
            winSplash = "LOSE";
        } else {
            winSplash = "DRAW";
        }
        console.log(winSplash);
        document.getElementById("playAgain").style.display = "block";
        document.getElementById("playArea").style.display = "none";
        document.getElementById("splash").innerText = winSplash;
    }, 2750)
    
}

function start () {
    document.getElementById("start").style.display = "none";
    document.getElementById("playAgain").style.display = "none";
    document.getElementById("playArea").style.display = "block";
    startGame();
}

//Organizing
function playLoop (playerInput) {
    if (playerHand.length == 0 && cpuHand.length == 0) {
        endScreen();
    }
    let thinkingTime = (Math.random())*2000+1000; //a value between 1000 and 3000/1 seconds and 3 seconds
    playerTurn(playerInput);
    displayDummyHand();
    displayCpu();
    thinking();
    updateLog();
    score();
    deckLeft();
    //This is the start of the CPU phase
    setTimeout(() => cardPlayed(), 100);
    setTimeout(() => cpuMove(), thinkingTime-200);
    setTimeout(() => displayCpu(), thinkingTime);
    setTimeout(() => displayHand(), thinkingTime);
    setTimeout(() => notThinking(), thinkingTime);
    setTimeout(() => updateLog(), thinkingTime);
    setTimeout(() => cardPlayed(), thinkingTime-100);
    setTimeout(() => score(), thinkingTime);
    setTimeout(() => deckLeft(), thinkingTime);
    setTimeout(() => document.getElementById("lastPlayed").innerHTML = "", thinkingTime+1000)
    setTimeout(() => {if (playerHand.length == 0 && cpuHand.length == 0) {endScreen();}}, thinkingTime+20);
}

//Organizing... also so that the user can restart and start again with a simple press of the button
function startGame () {
    create();
    shuffle();
    distribute();
    checkForPairs(playerPoints, playerHand);
    checkForPairs(cpuPoints, cpuHand);
    displayHand();
    displayCpu();
    notThinking();
    score();
    deckLeft();
    cpuMemory.clear(); //Clears memory in case the 
}

var lastPlayed = new Events(2, new Card(4, 15), 0); // Keeps track of what happened last turn. Initialized here becauseof the classes