// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDy52QtWtSJjGRliL-mBGE9tqTWlsjGjF4",
  authDomain: "real-time-app-using-firestore.firebaseapp.com",
  projectId: "real-time-app-using-firestore",
  storageBucket: "real-time-app-using-firestore.firebasestorage.app",
  messagingSenderId: "440500322848",
  appId: "1:440500322848:web:518ca55c2394eda3e2f245",
  measurementId: "G-F912E5WQGF"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the auth service
const auth = firebase.auth();

// Get a reference to the Firestore service
const db = firebase.firestore();

document.getElementById('signupForm').addEventListener('submit', submitForm);
document.getElementById('googleSignIn').addEventListener('click', signInWithGoogle);

function submitForm(e) {
  e.preventDefault();

  var usernameInp = document.getElementById('username').value;
  var passwordInp = document.getElementById('password').value;
  var emailInp = document.getElementById('email').value;
  
  auth.createUserWithEmailAndPassword(emailInp, passwordInp)
    .then((userCredential) => {
      // Signed in 
      var user = userCredential.user;
      // Add user to Firestore
      return db.collection("users").doc(user.uid).set({
        username: usernameInp,
        email: emailInp
      });
    })
    .then(() => {
      alert("Account created successfully!");
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert("Error: " + errorMessage);
    });
}

function signInWithGoogle() {
  var provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      var user = result.user;
      // Add user to Firestore
      return db.collection("users").doc(user.uid).set({
        username: user.displayName,
        email: user.email
      }, { merge: true });
    })
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      var errorMessage = error.message;
      alert("Error: " + errorMessage);
    });
}