app.controller("ProfileCtrl", ["$scope", "$routeParams",
    function ($scope, $routeParams) {
        
        $scope.uid = $routeParams.uid;
        $scope.user = {};
        
        fbGetProfile($scope.uid, function(response) {
            $scope.user = response;
            $scope.$apply();
        })
        
        $scope.createNewDeck = function() {
            fbCreateDeck($scope.uid, new Deck());
        }
                
    }]);
