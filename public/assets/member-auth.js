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

      rootRef.child("private/members").child(uid).once('value', function(snapshot) {
        var obj = snapshot.val();
        if (obj != null) {
          alert("An account attached to this email has already been registered!");
          window.location.href = "index.html";
        } else {
          console.log("New Account (Empty Data).");
        }
      }, function(error) {
        console.log("New Account (Error on Pull).");
      });

      try {
        document.getElementById("email").value = email;
        var res = displayName.split(" ");
        if (res.length >= 3) {
          document.getElementById("first_name").value = res[0];
          document.getElementById("last_name").value = res[2];
        } else {
          document.getElementById("first_name").value = res[0];
          document.getElementById("last_name").value = res[1];
        }

      } catch (e) {
        console.log(e);
      }

      });
    } else {
      // User is signed out.
      window.location.href = "index.html";
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
