describe("In 99", function() {

    var _gameLogic;

    beforeEach(module("99-SMG"));

    beforeEach(inject(function(gameLogic) {
        _gameLogic = gameLogic;
    }));


    function getTestGameInfo(params) {

        var GameInfo = _gameLogic.GameInfo;
        var Player = _gameLogic.Player;

        return new GameInfo(3, [new Player(0, params.hand0), new Player(1, params.hand1), new Player(2, params.hand2)], params.order, params.unusedCards, params.usedCards, params.points);

    }

    function getTestGameAction(params) {

        return {
            cardKey: params.playedCard[0],
            cardStr: params.playedCard[1]
        };

    }

    function getTestState(info, action) {
        return {
            "game-info": info,
            "game-action": action
        }
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

        var testGameAction = getTestGameAction({
            playedCard: ["C0", "3S"]
        });


        var move = [{
            setTurn: {
                turnIndex: 1
            }
        }, {
            set: {
                key: "game-action",
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
                key: "game-info",
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
    })







})
