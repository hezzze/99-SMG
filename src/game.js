angular.module('myApp')

.controller('GameCtrl', ['$rootScope', '$scope', '$log', '$timeout', 'gameService', 'stateService', 'gameLogic', 'aiService', 'resizeGameAreaService', '$translate', 'gameHelpers', function($rootScope, $scope, $log, $timeout,
    gameService, stateService, gameLogic, aiService,
    resizeGameAreaService, $translate, gameHelpers) {

    'use strict';

    resizeGameAreaService.setWidthToHeight(0.5625);

    var N_PLAYERS = 3;

    var state = null;
    var canMakeMove = false;
    var turnIndex = null;

    $scope.players = [{
        name: 'Siyang Wang',
        nCards: 4,
        face: 'https://lh6.googleusercontent.com/-_dwiJEb5DT4/AAAAAAAAAAI/AAAAAAAAADQ/yuvmLksvhAc/photo.jpg?sz=50'
    }, {
        name: 'Lin Zhang',
        nCards: 5,
        face: 'https://avatars3.githubusercontent.com/xiaozhanglin?v=3&s=460'
    }, {
        name: 'Zeyu He',
        nCards: 2,
        face: 'https://avatars3.githubusercontent.com/hezzze?v=3&s=460'
    }];

    var hand = ["AH", "KS", "2D", "BJ", "XC"];

    $scope.hand = hand.map(function(cardStr) {
        return {
            str: cardStr,
            frameIdx: gameHelpers.cardStrToFrameIdx(cardStr)
        };
    });

    function updateUI(params) {
        state = params.stateAfterMove;
        
        if (state.gameInfo === undefined) {

            //Start a new game
            //passing null to create move will generate
            //initial operations
            gameService.makeMove(gameLogic.getInitialOperations(N_PLAYERS));
            return;
        }
        canMakeMove = params.turnIndexAfterMove >= 0 && params.yourPlayerIndex === params.turnIndexAfterMove;
        turnIndex = params.turnIndexAfterMove;

        console.log(state);

    }

    gameService.setGame({
      gameDeveloperEmail: "hezzze@gmail.com",
      minNumberOfPlayers: N_PLAYERS,
      maxNumberOfPlayers: N_PLAYERS,
      isMoveOk: gameLogic.isMoveOk,
      updateUI: updateUI
    });

}])



.directive('hzSprite', ['gameHelpers', function(gameHelpers) {
    var link = function(scope, element, attrs) {

        var elmt = element[0];
        elmt.style.backgroundImage = "url(" + scope.src + ")";
        elmt.style.backgroundRepeat = "no-repeat";
        elmt.style.display = "inline-block";
        var nCols = parseInt(scope.nCols);
        var frameIndex = parseInt(scope.frameIndex);
        var spriteW;


        var resizeHandler = function() {

            spriteW = Math.round(gameHelpers.getComputedInnerWidth(elmt.parentElement) * parseFloat(scope.widthRatio));

            resize();
        };
        resizeHandler();


        function resize() {
            var spriteH = Math.round(spriteW * parseFloat(scope.ratio));
            elmt.style.width = spriteW + 'px';
            elmt.style.height = spriteH + 'px';
            elmt.style.backgroundPosition = (-(frameIndex % nCols) * spriteW) + 'px ' + (-Math.floor(frameIndex / nCols) * spriteH) + 'px';
            elmt.style.backgroundSize = 100 * nCols + "%";

        }

        window.addEventListener('resize', resizeHandler);

        element.on('$destroy', function() {
            window.removeEventListener('resize', resizeHandler);
        });


    };

    return {
        restrict: 'E',
        scope: {
            widthRatio: "@",
            ratio: "@", //height / width
            src: "@",
            nCols: "@",
            frameIndex: "@"
        },
        link: link
    }
}])

.directive("hzPlayer", ['gameHelpers', function(gameHelpers) {

    var link = function(scope, element, attrs) {
        var elmt = element[0];
        var width;

        var resizeHandler = function() {

            width = Math.round(gameHelpers.getComputedInnerWidth(elmt.parentElement) * parseFloat(scope.widthRatio));

            elmt.style.width = width + 'px';
            elmt.style.height = Math.round(width / 2) + 'px';

        };
        resizeHandler();

        window.addEventListener('resize', resizeHandler);

        element.on('$destroy', function() {
            window.removeEventListener('resize', resizeHandler);
        });
    };


    return {
        restrict: 'E',
        scope: {
            name: "@",
            widthRatio: "@",
            nCards: "@",
            avatarSrc: "@",
            pokerBackSrc: "@"
        },
        templateUrl: "ng-templates/player.html",
        link: link
    }
}]);
