// Firebase Auth
function initApp() {

  firebase.auth().onAuthStateChanged(function(user) {

    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var uid = user.uid;
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

        // Load database, error if not a moderator
        rootRef.child("moderators").once('value', function(snapshot) {
            // Is a moderator
            moderators_obj = snapshot.val();
            rootRef.child("private").once('value', function(snapshot) {
                private_obj = snapshot.val();
                rootRef.child("public").once('value', function(snapshot) {
                    public_obj = snapshot.val();
                    parseDatabase();
                    loadDatabase();
                  }, function(error) {
                    alert(error);
                    window.location.href = "login.html";
                });
              }, function(error) {
                alert(error);
                window.location.href = "login.html";
            });
          }, function(error) {
            alert("ERROR: Account does not cotain moderator status.");
            window.location.href = "login.html";
        });

        try {
          document.getElementById('login_name').innerHTML = '<a href="#" data-toggle="popover" ' +
            'data-placement="bottom" data-trigger="focus" data-html="true" data-content="<b>Email:</b><br></br>' +
            email + '<br></br><b>Private UID:</b><br></br>' + uid +
            '"><span class="glyphicon glyphicon-user"></span>   ' + displayName + '</a>';
          $('[data-toggle="popover"]').popover();
        } catch (e) {
          console.log(e);
        }

      });

    } else {
      // User is signed out.
      window.location.href = "login.html";
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
    window.location.href = "login.html";
  }, function(error) {
    console.error('Sign Out Error', error);
  });
}
