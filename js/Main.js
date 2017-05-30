/* Root Controller */
app.controller('MainCtrl', ['$scope',
    function ($scope) {

        $scope.user = {};
        $scope.loading = false;

        $scope.startLoad = function () {
            $scope.loading = true;
        }

        $scope.endLoad = function () {
            $scope.loading = false;
        }

        $scope.login = function () {
            login();
        }

        $scope.logout = function () {
            logout();
        }

        getAuthData($scope);

    }]);
