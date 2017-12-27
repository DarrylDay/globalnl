var rootRef = firebase.database().ref();

// Firebase Auth
function initApp() {

  firebase.auth().onAuthStateChanged(function(user) {

    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      uid = user.uid;
      var phoneNumber = user.phoneNumber;
      var providerData = user.providerData;
      user.getIdToken().then(function(accessToken) {
        var account_details = JSON.stringify({
          displayName: displayName,
          email: email,
          emailVerified: emailVerified,
          phoneNumber: phoneNumber,
          photoURL: photoURL,
          uid: uid,
          accessToken: accessToken,
          providerData: providerData
        }, null, '  ');

        try {

          // Desktop
          var code = '<li class="dropdown">' +
                        '<a class="dropdown-toggle" data-toggle="dropdown" href="#"><span class="glyphicon glyphicon-user"></span>   ' +
                          displayName + '</a>' +
                        '<ul class="dropdown-menu">' +
                          '<li><a href="#">' + email + '</a></li>' +
                          '<li class="divider"></li>' +
                          '<li><a href="#">Edit Profile</a></li>' +
                          '<li><a href="#" onclick="logout()">Logout</a></li>' +
                        '</ul>' +
                      '</li>';

          document.getElementById('login_name').innerHTML = code;

          // Mobile
          $("#user_controls_mobile").show();
          document.getElementById('login_name_mobile').innerHTML = '<a href="#"><span class="glyphicon glyphicon-user"></span>   ' + displayName + '</a>';

        } catch (e) {
          console.log(e);
        }

      });
    } else {



    }
  }, function(error) {
    console.log(error);
  });
}

// Init auth on load web page
window.addEventListener('load', function() {
  initApp()
});

// Logout of current account
function logout() {
  firebase.auth().signOut().then(function() {
    console.log('Signed Out');
    window.location.href = "index.html";
  }, function(error) {
    console.error('Sign Out Error', error);
  });
}
