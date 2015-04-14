angular.module('99-SMG')

.controller('GameCtrl', ['$rootScope', '$scope', '$log', '$timeout', 'gameService', 'stateService', 'gameLogic', 'aiService', 'resizeGameAreaService', '$translate', function(($rootScope, $scope, $log, $timeout,
            gameService, stateService, gameLogic, aiService,
            resizeGameAreaService, $translate) {

            'use strict';

            resizeGameAreaService.setWidthToHeight(0.5);

            var state = null;
            var isMyTurn = false;

            function updateUI(params) {
                state = params.stateAfterMove;

                if (state.gameInfo == undefined) {

                    //Start a new game
                    //passing null to create move will generate
                    //initial operations
                    gameService.makeMove(gameLogic.createMove(null));
                    return;
                }



            }

        }])

.directive('hz-sprite', function() {
	var link = function(scope, element, attrs) {

	};


	return {
		restrict: 'E',
		link: link
	}
}) 
