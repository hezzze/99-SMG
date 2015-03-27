angular.module('99-SMG', []).factory('gameLogic', function() {

    'use strict';

    // Constants
    var RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "X", "J", "Q", "K"];

    var RED_JOKER = "RJ",
        BLACK_JOKER = "BJ",
        CLUBS = "C",
        DIAMONDS = "D",
        HEARTS = "H",
        SPADES = "S";
    var SUITS = [CLUBS, DIAMONDS, HEARTS, SPADES];

    var N_DECK = 2;
    var TOTAL_N_CARDS = RANKS.length * SUITS.length * N_DECK;
    var N_CARDS_PER_HAND = 5;
    var CARD_KEY_PREFIX = "C";
    var USED_PILE_KEY = "U";
    var GAME_INFO_KEY = "game-info";
    var GAME_ACTION_KEY = "game-action";
    var N_PLAYERS = 3;
    var GAME_ACTION_OPERATION_IDX = 1;




    function Player(idx, hand) {

        if (idx === undefined || idx === null) {
            throw new Error("missing index, construct Player error!");
        }

        this.idx = idx; //integer， required
        this.hand = hand || []; //array of string
        this.good = function() {
            return this.hand.length > 0;
        }

    }

    //Game invariant
    // - A player is dead if and only if has not no cards

    //Game initialization process:
    // 1. server sends empty stateAfterMove to updateUI
    // 2. In updateUI if the stateAfterMove[GAME_INFO_KEY] is null then
    //  call gameLogic.createMove with empty action and pass the move 
    //  to gameService.makeMove which will be the initial operations

    function GameInfo(nPlayers, players, order, unused, used, points) {

        this.players = players || [];
        this.order = order; //boolean
        this.unusedCards = unused || [];
        this.usedCards = used || [];

        //Not initialize with players 
        if (players.length === 0) {
            for (var i = 0; i < nPlayers; i++) {
                this.players.push(new Player(i));
            }
        }


        this.points = points || 0;

        this.getWinner = function() {

            var nGood = this.players.filter(function(p) {
                return p.good();
            });

            if (nGood.length < 1) {

                throw new Error("nGood's length can't be less than 1! (" + nGood.length + ")");
            }

            if (nGood.length === 1) {
                return nGood[0];
            } else {
                return null;
            }
        }

        this.getNextTurnIndex = function(turnIdx) {

            var turnIdx;
            do {
                turnIdx = (turnIdx + (this.order ? 1 : -1)) % this.players.length;
                if (turnIdx < 0) turnIdx = players.length - 1;
            } while (!this.players[turnIdx].good());

            return turnIdx;
        }

    }

    function getInitialOperations(nPlayers) {
        var operations = [{
            setTurn: {
                turnIndex: 0
            }
        }, {
            set: {
                key: GAME_ACTION_KEY,
                value: null
            }
        }];



        for (var i = 0; i < TOTAL_N_CARDS; i++) {
            operations.push({
                set: {
                    key: CARD_KEY_PREFIX + i,
                    value: RANKS[i % RANKS.length] + SUITS[i % SUITS.length]
                }
            })
        }

        var gameInfo = new GameInfo(nPlayers);

        //variable for shuffling
        var cardKeys = [];

        //set visibility for deck and push card indexes 
        // to players in game info obj
        for (i = 0; i < TOTAL_N_CARDS; i++) {

            //fill player hands
            if (i < nPlayers * N_CARDS_PER_HAND) {
                operations.push({
                    setVisibility: {
                        key: CARD_KEY_PREFIX + i,
                        visibleToPlayerIndexes: [i % nPlayers]
                    }
                });

                gameInfo.players[i % nPlayers].hand.push(CARD_KEY_PREFIX + i);
            } else {

                //put cards left into the unused pile
                gameInfo.unusedCards.push(CARD_KEY_PREFIX + i);
            }

            // for shuffling
            cardKeys.push(CARD_KEY_PREFIX + i);


        }

        //set value for game info obj
        operations.push({
            set: {
                key: GAME_INFO_KEY,
                value: gameInfo
            }
        });

        //shuffle
        operations.push({
            shuffle: {
                keys: cardKeys
            }
        });
    }

    function getPossibleMoves() {
        //TODO
    }


    function createMove(action, gameInfo, turnIdx) {

        //initial condition
        if (action === null || action === undefined || gameInfo === null || gameInfo === undefined) {
            return getInitialOperations(N_PLAYERS);
        }

        var operations = [{
            set: {
                key: GAME_ACTION_KEY,
                value: action
            }
        }];

        //============ USE CARD ==============

        //remove the used card from the player
        // and move it to the used pile 
        var gameInfoAfter = angular.copy(gameInfo);

        //true if the player can draw another card
        var turnPlayerCanDraw = true;
        var players = gameInfoAfter.players;
        var turnPlayer = players[turnIdx];
        var target = players[action.targetIdx];
        var playedChooseNext = false;
        var nextTurnIndex;

        if (!turnPlayer.hand.contains(action.cardKey)) {
            throw new Error(action.cardKey + "not found in player's hand!");
        }

        turnPlayer.hand.remove(turnPlayer.hand.indexOf(action.cardKey));
        gameInfoAfter.usedCards.push(action.cardKey);

        operations.push({
            setVisibility: {
                key: action.cardKey,
                visibleToPlayerIndexes: null //visible to all
            }
        });




        //============= TAKE EFFECT ==================
        var cardRank = action.cardStr.charAt(0);
        switch (cardRank) {
            case "2":
            case "3":
            case "5":
            case "6":
            case "8":
            case "9":
                gameInfoAfter.points += parseInt(cardRank);
                break;
            case "A":
                playedChooseNext = true;
                nextTurnIndex = action.targetIdx;

                break;

            case "X":
            case "Q":
                var coef = (action.how.sub ? -1 : 1);
                gameInfoAfter.points += (cardRank === "X" ? coef * 10 : coef * 20);
                break;
            case "4":
                gameInfoAfter.order = !gameInfoAfter.order;
                break;
            case "J":
                turnPlayerCanDraw = false;
                //TODO Exception target can't be a dead player
                if (!target.good()) {
                    throw new Error("Target can't be a dead player when playing a <J>");
                }


                var cardKeyDrawn = target.hand[action.how.drawIdx];
                target.hand.remove(action.how.drawIdx);
                turnPlayer.hand.push(cardKeyDrawn);
                operations.push({
                    setVisibility: {
                        key: cardKeyDrawn,
                        visibleToPlayerIndexes: [turnIdx]
                    }
                });
                break;
            case "K":
                gameInfoAfter.points = 99;
                break;
            case "7":
                turnPlayerCanDraw = false;
                //TODO target can't be a dead player

                if (!target.good()) {
                    throw new Error("Target can't be a dead player when playing a <7>");
                }

                var hand = turnPlayer.hand;
                turnPlayer.hand = target.hand;
                target.hand = hand;
                target.hand.forEach(function(d, i) {
                    operations.push({
                        setVisibility: {
                            key: d,
                            visibleToPlayerIndexes: [action.targetIdx]
                        }
                    });
                });
                turnPlayer.hand.forEach(function(d,i) {
                    operations.push({
                        setVisibility: {
                            key: d,
                            visibleToPlayerIndexes: [turnIdx]
                        }
                    });
                });

                break;

                //TODO
                // PLAY CURSE
                // PLAY REVIVE

            default:
                throw new Error("Illegal card rank");

        }


        if (gameInfoAfter.points > 99) {
            gameInfoAfter.usedCards = gameInfoAfter.usedCards.concat(turnPlayer.hand);

            //player failed, reaction hand 
            // to change its status
            turnPlayer.hand = [];
        }

        // Draw a card at the end of the turn
        //assume the unused pile will never be empty
        // at this moment

        if (turnPlayerCanDraw) {

            var newCardKey = gameInfoAfter.unusedCards.shift();

            turnPlayer.hand.push(newCardKey);

            operations.push({
                setVisibility:{
                    key: newCardKey,
                    visibleToPlayerIndexes: [turnIdx]
                }
            })
        }

        
        if (gameInfoAfter.unusedCards.length === 0) {

            // set visibility for every usedCards
            gameInfoAfter.usedCards.forEach(function(ckey) {
                operations.push({
                    setVisibility: {
                        key: ckey,
                        visibleToPlayerIndexes: []
                    }
                });
            });

            //fill unused pile
            // simply fills it with used pile
            gameInfoAfter.unusedCards = gameInfoAfter.usedCards;
            gameInfoAfter.usedCards = [];
        }
        


        var firstOperation;



        if (!playedChooseNext) {
            nextTurnIndex = gameInfoAfter.getNextTurnIndex(turnIdx);
        }


        if (gameInfoAfter.getWinner() !== null) {
            firstOperation = {
                endMatch: {
                    endMatchScores: 0
                }
            };
        } else {
            firstOperation = {
                setTurn: {
                    turnIndex: nextTurnIndex
                }
            }
        }


        //set gameInfo
        operations.push({
            set: {
                key: GAME_INFO_KEY,
                value: gameInfoAfter
            }
        });


        //Add first operation
        operations.unshift(firstOperation);

        console.log(operations);

        return operations;

    }


    function isMoveOk(params) {

        var move = params.move;
        var turnIndexBeforeMove = params.turnIndexBeforeMove;
        var stateBeforeMove = params.stateBeforeMove;

        try {
            var action = move[GAME_ACTION_OPERATION_IDX].set.value;
            var gameInfo = stateBeforeMove[GAME_INFO_KEY];
            var expectedMove = createMove(action, gameInfo, turnIndexBeforeMove);
            if (!angular.equals(move, expectedMove)) {
                //console.log(move);

                return false;
            }
        } catch (e) {
            //if there are any exceptions then the move is illegal

            console.log(e.message);

            return false;
        }
        return true;
    }


    return {
        createMove: createMove,
        isMoveOk: isMoveOk,
        GameInfo: GameInfo,
        Player: Player
    };


});


//Helper 

Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

Array.prototype.contains = function(elmt) {
    return this.indexOf(elmt) !== -1;
};

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
//http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
Array.prototype.shuffle = function() {
    for (var j, x, i = this.length; i; j = Math.floor(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
    return this;
};
