describe("In 99", function() {

    var _gameLogic;

    beforeEach(module("99-SMG"));

    beforeEach(inject(function(gameLogic) {
        _gameLogic = gameLogic;
    }));

    var GAME_INFO_KEY = "gameInfo";
    var GAME_ACTION_KEY = "gameAction";


    function getTestGameInfo(params) {

        var GameInfo = _gameLogic.GameInfo;
        var Player = _gameLogic.Player;

        return new GameInfo(3, [new Player(0, params.hand0), new Player(1, params.hand1), new Player(2, params.hand2)], params.order, params.unusedCards, params.usedCards, params.points);

    }

    function getTestState(info, action) {

        var obj = {};

        obj[GAME_INFO_KEY] = info;
        obj[GAME_ACTION_KEY] = action;

        return obj;
    }


    function expectMoveOk(turnIndexBeforeMove, stateBeforeMove, move) {
        expect(_gameLogic.isMoveOk({
            turnIndexBeforeMove: turnIndexBeforeMove,
            stateBeforeMove: stateBeforeMove,
            move: move
        })).toBe(true);
    }

    function expectIllegalMove(turnIndexBeforeMove, stateBeforeMove, move) {
        expect(_gameLogic.isMoveOk({
            turnIndexBeforeMove: turnIndexBeforeMove,
            stateBeforeMove: stateBeforeMove,
            move: move
        })).toBe(false);
    }

    it("Playing a normal card (3 of spades)", function() {

        //Game info before the move
        var testGameInfo = getTestGameInfo({
            hand0: ["C0", "C1", "C2", "C3", "C4"],
            hand1: ["C5", "C6", "C7", "C8", "C9"],
            hand2: ["C10", "C11", "C12", "C13", "C14"],
            order: true,
            unusedCards: ["C15", "C16", "C17"],
            usedCards: [],
            points: 0
        });

        var testGameAction = {
            cardKey: "C0",
            cardStr: "3S"
        };


        var move = [{
            setTurn: {
                turnIndex: 1
            }
        }, {
            set: {
                key: GAME_ACTION_KEY,
                value: testGameAction
            }
        }, {
            setVisibility: {
                key: "C0",
                visibleToPlayerIndexes: null
            }
        }, {
            setVisibility: {
                key: "C15",
                visibleToPlayerIndexes: [0]
            }
        }, {
            set: {
                key: GAME_INFO_KEY,
                //Game info after the move
                value: getTestGameInfo({
                    hand0: ["C1", "C2", "C3", "C4", "C15"],
                    hand1: ["C5", "C6", "C7", "C8", "C9"],
                    hand2: ["C10", "C11", "C12", "C13", "C14"],
                    order: true,
                    unusedCards: ["C16", "C17"],
                    usedCards: ["C0"],
                    points: 3
                })
            }
        }];


        expectMoveOk(0, getTestState(testGameInfo, testGameAction), move);
    });

    it("Playing a choose next (Ace of clubs)", function() {

        //Game info before the move
        var testGameInfo = getTestGameInfo({
            hand0: ["C0", "C1", "C2", "C3", "C4"],
            hand1: ["C5", "C6", "C7", "C8", "C9"],
            hand2: ["C10", "C11", "C12", "C13", "C14"],
            order: true,
            unusedCards: ["C15", "C16", "C17"],
            usedCards: [],
            points: 99
        });

        var testGameAction = {
            cardKey: "C0",
            cardStr: "AC",
            targetIdx: 2
        };


        var move = [{
            setTurn: {
                turnIndex: 2
            }
        }, {
            set: {
                key: GAME_ACTION_KEY,
                value: testGameAction
            }
        }, {
            setVisibility: {
                key: "C0",
                visibleToPlayerIndexes: null
            }
        }, {
            setVisibility: {
                key: "C15",
                visibleToPlayerIndexes: [0]
            }
        }, {
            set: {
                key: GAME_INFO_KEY,
                //Game info after the move
                value: getTestGameInfo({
                    hand0: ["C1", "C2", "C3", "C4", "C15"],
                    hand1: ["C5", "C6", "C7", "C8", "C9"],
                    hand2: ["C10", "C11", "C12", "C13", "C14"],
                    order: true,
                    unusedCards: ["C16", "C17"],
                    usedCards: ["C0"],
                    points: 99
                })
            }
        }];


        expectMoveOk(0, getTestState(testGameInfo, testGameAction), move);
    });


    it("Playing an add 10 (10 of hearts)", function() {

        //Game info before the move
        var testGameInfo = getTestGameInfo({
            hand0: ["C0", "C1", "C2", "C3", "C4"],
            hand1: ["C5", "C6", "C7", "C8", "C9"],
            hand2: ["C10", "C11", "C12", "C13", "C14"],
            order: true,
            unusedCards: ["C15", "C16", "C17"],
            usedCards: [],
            points: 30
        });

        var testGameAction = {
            cardKey: "C0",
            cardStr: "XH",
            how: {
                sub: false
            }
        };


        var move = [{
            setTurn: {
                turnIndex: 1
            }
        }, {
            set: {
                key: GAME_ACTION_KEY,
                value: testGameAction
            }
        }, {
            setVisibility: {
                key: "C0",
                visibleToPlayerIndexes: null
            }
        }, {
            setVisibility: {
                key: "C15",
                visibleToPlayerIndexes: [0]
            }
        }, {
            set: {
                key: GAME_INFO_KEY,
                //Game info after the move
                value: getTestGameInfo({
                    hand0: ["C1", "C2", "C3", "C4", "C15"],
                    hand1: ["C5", "C6", "C7", "C8", "C9"],
                    hand2: ["C10", "C11", "C12", "C13", "C14"],
                    order: true,
                    unusedCards: ["C16", "C17"],
                    usedCards: ["C0"],
                    points: 40
                })
            }
        }];


        expectMoveOk(0, getTestState(testGameInfo, testGameAction), move);
    });


    it("Playing a minus 20 (Q of diamonds)", function() {

        //Game info before the move
        var testGameInfo = getTestGameInfo({
            hand0: ["C0", "C1", "C2", "C3", "C4"],
            hand1: ["C5", "C6", "C7", "C8", "C9"],
            hand2: ["C10", "C11", "C12", "C13", "C14"],
            order: true,
            unusedCards: ["C15", "C16", "C17"],
            usedCards: [],
            points: 99
        });

        var testGameAction = {
            cardKey: "C0",
            cardStr: "QD",
            how: {
                sub: true
            }
        };


        var move = [{
            setTurn: {
                turnIndex: 1
            }
        }, {
            set: {
                key: GAME_ACTION_KEY,
                value: testGameAction
            }
        }, {
            setVisibility: {
                key: "C0",
                visibleToPlayerIndexes: null
            }
        }, {
            setVisibility: {
                key: "C15",
                visibleToPlayerIndexes: [0]
            }
        }, {
            set: {
                key: GAME_INFO_KEY,
                //Game info after the move
                value: getTestGameInfo({
                    hand0: ["C1", "C2", "C3", "C4", "C15"],
                    hand1: ["C5", "C6", "C7", "C8", "C9"],
                    hand2: ["C10", "C11", "C12", "C13", "C14"],
                    order: true,
                    unusedCards: ["C16", "C17"],
                    usedCards: ["C0"],
                    points: 79
                })
            }
        }];


        expectMoveOk(0, getTestState(testGameInfo, testGameAction), move);
    });


    it("Playing a reverse (4 of diamonds)", function() {

        //Game info before the move
        var testGameInfo = getTestGameInfo({
            hand0: ["C0", "C1", "C2", "C3", "C4"],
            hand1: ["C5", "C6", "C7", "C8", "C9"],
            hand2: ["C10", "C11", "C12", "C13", "C14"],
            order: true,
            unusedCards: ["C15", "C16", "C17"],
            usedCards: [],
            points: 99
        });

        var testGameAction = {
            cardKey: "C0",
            cardStr: "4D"
        };


        var move = [{
            setTurn: {
                turnIndex: 2
            }
        }, {
            set: {
                key: GAME_ACTION_KEY,
                value: testGameAction
            }
        }, {
            setVisibility: {
                key: "C0",
                visibleToPlayerIndexes: null
            }
        }, {
            setVisibility: {
                key: "C15",
                visibleToPlayerIndexes: [0]
            }
        }, {
            set: {
                key: GAME_INFO_KEY,
                //Game info after the move
                value: getTestGameInfo({
                    hand0: ["C1", "C2", "C3", "C4", "C15"],
                    hand1: ["C5", "C6", "C7", "C8", "C9"],
                    hand2: ["C10", "C11", "C12", "C13", "C14"],
                    order: false,
                    unusedCards: ["C16", "C17"],
                    usedCards: ["C0"],
                    points: 99
                })
            }
        }];

        expectMoveOk(0, getTestState(testGameInfo, testGameAction), move);
    });

    it("Playing a reverse (J of diamonds)", function() {

        //Game info before the move
        var testGameInfo = getTestGameInfo({
            hand0: ["C0", "C1", "C2", "C3", "C4"],
            hand1: ["C5", "C6", "C7", "C8", "C9"],
            hand2: ["C10", "C11", "C12", "C13", "C14"],
            order: false,
            unusedCards: ["C15", "C16", "C17"],
            usedCards: [],
            points: 99
        });

        var testGameAction = {
            cardKey: "C0",
            cardStr: "JD",
            targetIdx: 1,
            how: {
                drawIdx: 2
            }
        };


        var move = [{
            setTurn: {
                turnIndex: 2
            }
        }, {
            set: {
                key: GAME_ACTION_KEY,
                value: testGameAction
            }
        }, {
            setVisibility: {
                key: "C0",
                visibleToPlayerIndexes: null
            }
        }, {
            setVisibility: {
                key: "C7",
                visibleToPlayerIndexes: [0]
            }
        }, {
            set: {
                key: GAME_INFO_KEY,
                //Game info after the move
                value: getTestGameInfo({
                    hand0: ["C1", "C2", "C3", "C4", "C7"],
                    hand1: ["C5", "C6", "C8", "C9"],
                    hand2: ["C10", "C11", "C12", "C13", "C14"],
                    order: false,
                    unusedCards: ["C15", "C16", "C17"],
                    usedCards: ["C0"],
                    points: 99
                })
            }
        }];

        expectMoveOk(0, getTestState(testGameInfo, testGameAction), move);
    });


    it("Playing a 99 (K of diamonds)", function() {

        //Game info before the move
        var testGameInfo = getTestGameInfo({
            hand0: ["C0", "C1", "C2", "C3", "C4"],
            hand1: ["C5", "C6", "C7", "C8", "C9"],
            hand2: ["C10", "C11", "C12", "C13", "C14"],
            order: true,
            unusedCards: ["C15", "C16", "C17"],
            usedCards: [],
            points: 8
        });

        var testGameAction = {
            cardKey: "C0",
            cardStr: "KD"
        };


        var move = [{
            setTurn: {
                turnIndex: 1
            }
        }, {
            set: {
                key: GAME_ACTION_KEY,
                value: testGameAction
            }
        }, {
            setVisibility: {
                key: "C0",
                visibleToPlayerIndexes: null
            }
        }, {
            setVisibility: {
                key: "C15",
                visibleToPlayerIndexes: [0]
            }
        }, {
            set: {
                key: GAME_INFO_KEY,
                //Game info after the move
                value: getTestGameInfo({
                    hand0: ["C1", "C2", "C3", "C4", "C15"],
                    hand1: ["C5", "C6", "C7", "C8", "C9"],
                    hand2: ["C10", "C11", "C12", "C13", "C14"],
                    order: true,
                    unusedCards: ["C16", "C17"],
                    usedCards: ["C0"],
                    points: 99
                })
            }
        }];

        expectMoveOk(0, getTestState(testGameInfo, testGameAction), move);
    });


    it("Playing a exchange (7 of diamonds)", function() {

        //Game info before the move
        var testGameInfo = getTestGameInfo({
            hand0: ["C0", "C1", "C2", "C3", "C4"],
            hand1: ["C5", "C6", "C7", "C8", "C9"],
            hand2: ["C10", "C11", "C12", "C13", "C14"],
            order: true,
            unusedCards: ["C15", "C16", "C17"],
            usedCards: [],
            points: 8
        });

        var testGameAction = {
            cardKey: "C0",
            cardStr: "7D",
            targetIdx: 1
        };


        var move = [{
            setTurn: {
                turnIndex: 1
            }
        }, {
            set: {
                key: GAME_ACTION_KEY,
                value: testGameAction
            }
        }, {
            setVisibility: {
                key: "C0",
                visibleToPlayerIndexes: null
            }
        }, {
            setVisibility: {
                key: "C1",
                visibleToPlayerIndexes: [1]
            }
        }, {
            setVisibility: {
                key: "C2",
                visibleToPlayerIndexes: [1]
            }
        }, {
            setVisibility: {
                key: "C3",
                visibleToPlayerIndexes: [1]
            }
        }, {
            setVisibility: {
                key: "C4",
                visibleToPlayerIndexes: [1]
            }
        }, {
            setVisibility: {
                key: "C5",
                visibleToPlayerIndexes: [0]
            }
        }, {
            setVisibility: {
                key: "C6",
                visibleToPlayerIndexes: [0]
            }
        }, {
            setVisibility: {
                key: "C7",
                visibleToPlayerIndexes: [0]
            }
        }, {
            setVisibility: {
                key: "C8",
                visibleToPlayerIndexes: [0]
            }
        }, {
            setVisibility: {
                key: "C9",
                visibleToPlayerIndexes: [0]
            }
        }, {
            set: {
                key: GAME_INFO_KEY,
                //Game info after the move
                value: getTestGameInfo({
                    hand0: ["C5", "C6", "C7", "C8", "C9"],
                    hand1: ["C1", "C2", "C3", "C4"],
                    hand2: ["C10", "C11", "C12", "C13", "C14"],
                    order: true,
                    unusedCards: ["C15", "C16", "C17"],
                    usedCards: ["C0"],
                    points: 8
                })
            }
        }];

        expectMoveOk(0, getTestState(testGameInfo, testGameAction), move);
    });


    it("illegal move: play card not in hand", function() {

        //Game info before the move
        var testGameInfo = getTestGameInfo({
            hand0: ["C0", "C1", "C2", "C3", "C4"],
            hand1: ["C5", "C6", "C7", "C8", "C9"],
            hand2: ["C10", "C11", "C12", "C13", "C14"],
            order: true,
            unusedCards: ["C15", "C16", "C17"],
            usedCards: [],
            points: 8
        });

        var testGameAction = {
            cardKey: "C5",
            cardStr: "KD"
        };


        var move = [{
            setTurn: {
                turnIndex: 1
            }
        }, {
            set: {
                key: GAME_ACTION_KEY,
                value: testGameAction
            }
        }, {
            setVisibility: {
                key: "C0",
                visibleToPlayerIndexes: null
            }
        }, {
            setVisibility: {
                key: "C15",
                visibleToPlayerIndexes: [0]
            }
        }, {
            set: {
                key: GAME_INFO_KEY,
                //Game info after the move
                value: getTestGameInfo({
                    hand0: ["C1", "C2", "C3", "C4", "C15"],
                    hand1: ["C5", "C6", "C7", "C8", "C9"],
                    hand2: ["C10", "C11", "C12", "C13", "C14"],
                    order: true,
                    unusedCards: ["C16", "C17"],
                    usedCards: ["C0"],
                    points: 8
                })
            }
        }];

        expectIllegalMove(0, getTestState(testGameInfo, testGameAction), move);
    });

    it("illegal move: draw from a dead player", function() {

        //Game info before the move
        var testGameInfo = getTestGameInfo({
            hand0: ["C0", "C1", "C2", "C3", "C4"],
            hand1: ["C5", "C6", "C7", "C8", "C9"],
            hand2: [],
            order: true,
            unusedCards: ["C15", "C16", "C17"],
            usedCards: [],
            points: 8
        });

        var testGameAction = {
            cardKey: "C0",
            cardStr: "JD",
            targetIdx: 2,
            how: {
                drawIdx: 0
            }
        };


        var move = [{
            setTurn: {
                turnIndex: 1
            }
        }, {
            set: {
                key: GAME_ACTION_KEY,
                value: testGameAction
            }
        }, {
            setVisibility: {
                key: "C0",
                visibleToPlayerIndexes: null
            }
        }, {
            setVisibility: {
                key: "C15",
                visibleToPlayerIndexes: [0]
            }
        }, {
            set: {
                key: GAME_INFO_KEY,
                //Game info after the move
                value: getTestGameInfo({
                    hand0: ["C1", "C2", "C3", "C4", "C15"],
                    hand1: ["C5", "C6", "C7", "C8", "C9"],
                    hand2: ["C10", "C11", "C12", "C13", "C14"],
                    order: true,
                    unusedCards: ["C16", "C17"],
                    usedCards: ["C0"],
                    points: 8
                })
            }
        }];

        expectIllegalMove(0, getTestState(testGameInfo, testGameAction), move);
    });


    it("illegal move: exchange with a dead player", function() {

        //Game info before the move
        var testGameInfo = getTestGameInfo({
            hand0: ["C0", "C1", "C2", "C3", "C4"],
            hand1: ["C5", "C6", "C7", "C8", "C9"],
            hand2: [],
            order: true,
            unusedCards: ["C15", "C16", "C17"],
            usedCards: [],
            points: 8
        });

        var testGameAction = {
            cardKey: "C0",
            cardStr: "7D",
            targetIdx: 2,
        };


        var move = [{
            setTurn: {
                turnIndex: 1
            }
        }, {
            set: {
                key: GAME_ACTION_KEY,
                value: testGameAction
            }
        }, {
            setVisibility: {
                key: "C0",
                visibleToPlayerIndexes: null
            }
        }, {
            setVisibility: {
                key: "C15",
                visibleToPlayerIndexes: [0]
            }
        }, {
            set: {
                key: GAME_INFO_KEY,
                //Game info after the move
                value: getTestGameInfo({
                    hand0: ["C1", "C2", "C3", "C4", "C15"],
                    hand1: ["C5", "C6", "C7", "C8", "C9"],
                    hand2: ["C10", "C11", "C12", "C13", "C14"],
                    order: true,
                    unusedCards: ["C16", "C17"],
                    usedCards: ["C0"],
                    points: 8
                })
            }
        }];

        expectIllegalMove(0, getTestState(testGameInfo, testGameAction), move);
    });

    it("illegal move: illegal card rank", function() {

        //Game info before the move
        var testGameInfo = getTestGameInfo({
            hand0: ["C0", "C1", "C2", "C3", "C4"],
            hand1: ["C5", "C6", "C7", "C8", "C9"],
            hand2: [],
            order: true,
            unusedCards: ["C15", "C16", "C17"],
            usedCards: [],
            points: 8
        });

        var testGameAction = {
            cardKey: "C0",
            cardStr: "OD"
        };


        var move = [{
            setTurn: {
                turnIndex: 1
            }
        }, {
            set: {
                key: GAME_ACTION_KEY,
                value: testGameAction
            }
        }, {
            setVisibility: {
                key: "C0",
                visibleToPlayerIndexes: null
            }
        }, {
            setVisibility: {
                key: "C15",
                visibleToPlayerIndexes: [0]
            }
        }, {
            set: {
                key: GAME_INFO_KEY,
                //Game info after the move
                value: getTestGameInfo({
                    hand0: ["C1", "C2", "C3", "C4", "C15"],
                    hand1: ["C5", "C6", "C7", "C8", "C9"],
                    hand2: ["C10", "C11", "C12", "C13", "C14"],
                    order: true,
                    unusedCards: ["C16", "C17"],
                    usedCards: ["C0"],
                    points: 8
                })
            }
        }];

        expectIllegalMove(0, getTestState(testGameInfo, testGameAction), move);
    });

    it("Player death: play normal when total points is 99", function() {

        //Game info before the move
        var testGameInfo = getTestGameInfo({
            hand0: ["C0", "C1", "C2", "C3", "C4"],
            hand1: ["C5", "C6", "C7", "C8", "C9"],
            hand2: ["C10", "C11", "C12", "C13", "C14"],
            order: true,
            unusedCards: ["C15", "C16", "C17"],
            usedCards: [],
            points: 99
        });

        var testGameAction = {
            cardKey: "C0",
            cardStr: "2D"
        };


        var move = [{
            setTurn: {
                turnIndex: 1
            }
        }, {
            set: {
                key: GAME_ACTION_KEY,
                value: testGameAction
            }
        }, {
            setVisibility: {
                key: "C0",
                visibleToPlayerIndexes: null
            }
        }, {
            setVisibility: {
                key: "C1",
                visibleToPlayerIndexes: null
            }
        }, {
            setVisibility: {
                key: "C2",
                visibleToPlayerIndexes: null
            }
        }, {
            setVisibility: {
                key: "C3",
                visibleToPlayerIndexes: null
            }
        }, {
            setVisibility: {
                key: "C4",
                visibleToPlayerIndexes: null
            }
        }, {
            set: {
                key: GAME_INFO_KEY,
                //Game info after the move
                value: getTestGameInfo({
                    hand0: [],
                    hand1: ["C5", "C6", "C7", "C8", "C9"],
                    hand2: ["C10", "C11", "C12", "C13", "C14"],
                    order: true,
                    unusedCards: ["C15", "C16", "C17"],
                    usedCards: ["C0", "C1", "C2", "C3", "C4"],
                    points: 99
                })
            }
        }];

        expectMoveOk(0, getTestState(testGameInfo, testGameAction), move);
    });

    it("Used up all the cards", function() {

        //Game info before the move
        var testGameInfo = getTestGameInfo({
            hand0: ["C0", "C1", "C2", "C3", "C4"],
            hand1: ["C5", "C6", "C7", "C8", "C9"],
            hand2: ["C10", "C11", "C12", "C13", "C14"],
            order: true,
            unusedCards: ["C15"],
            usedCards: ["C16", "C17"],
            points: 97
        });

        var testGameAction = {
            cardKey: "C0",
            cardStr: "2D"
        };


        var move = [{
            setTurn: {
                turnIndex: 1
            }
        }, {
            set: {
                key: GAME_ACTION_KEY,
                value: testGameAction
            }
        }, {
            setVisibility: {
                key: "C0",
                visibleToPlayerIndexes: null
            }
        }, {
            setVisibility: {
                key: "C15",
                visibleToPlayerIndexes: [0]
            }
        }, {
            setVisibility: {
                key: "C16",
                visibleToPlayerIndexes: []
            }
        }, {
            setVisibility: {
                key: "C17",
                visibleToPlayerIndexes: []
            }
        }, {
            setVisibility: {
                key: "C0",
                visibleToPlayerIndexes: []
            }
        }, {
            set: {
                key: GAME_INFO_KEY,
                //Game info after the move
                value: getTestGameInfo({
                    hand0: ["C1", "C2", "C3", "C4", "C15"],
                    hand1: ["C5", "C6", "C7", "C8", "C9"],
                    hand2: ["C10", "C11", "C12", "C13", "C14"],
                    order: true,
                    unusedCards: ["C16", "C17", "C0"],
                    usedCards: [],
                    points: 99
                })
            }
        }];

        expectMoveOk(0, getTestState(testGameInfo, testGameAction), move);
    });

    it("Player death and end game", function() {

        //Game info before the move
        var testGameInfo = getTestGameInfo({
            hand0: ["C0", "C1", "C2", "C3", "C4"],
            hand1: [],
            hand2: ["C10", "C11", "C12", "C13", "C14"],
            order: true,
            unusedCards: ["C15", "C16", "C17"],
            usedCards: [],
            points: 99
        });

        var testGameAction = {
            cardKey: "C0",
            cardStr: "2D"
        };


        var move = [{
            endMatch: {
                endMatchScores: 0
            }
        }, {
            set: {
                key: GAME_ACTION_KEY,
                value: testGameAction
            }
        }, {
            setVisibility: {
                key: "C0",
                visibleToPlayerIndexes: null
            }
        }, {
            setVisibility: {
                key: "C1",
                visibleToPlayerIndexes: null
            }
        }, {
            setVisibility: {
                key: "C2",
                visibleToPlayerIndexes: null
            }
        }, {
            setVisibility: {
                key: "C3",
                visibleToPlayerIndexes: null
            }
        }, {
            setVisibility: {
                key: "C4",
                visibleToPlayerIndexes: null
            }
        }, {
            set: {
                key: GAME_INFO_KEY,
                //Game info after the move
                value: getTestGameInfo({
                    hand0: [],
                    hand1: [],
                    hand2: ["C10", "C11", "C12", "C13", "C14"],
                    order: true,
                    unusedCards: ["C15", "C16", "C17"],
                    usedCards: ["C0", "C1", "C2", "C3", "C4"],
                    points: 99
                })
            }
        }];

        expectMoveOk(0, getTestState(testGameInfo, testGameAction), move);
    });


})
