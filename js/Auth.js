function login() {
    firebase.auth().signInWithRedirect(provider);
}

function logout(scope) {
    firebase.auth().signOut();
}

function upsertUserData(user) {
    fbGetUser(user.uid, function(response) {
        if (response == null) {
            fbWriteUserData(user);
        }
    });
}

function getAuthData(scope) {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            upsertUserData(user);
            scope.user = user;
            scope.$apply();
        } else {
            scope.user = {};
            scope.$apply();
        }
    });
}