// Firebase configuration (same as in app.js)
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

// Check if user is logged in
auth.onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in
    displayUserInfo(user);
    loadPosts();
  } else {
    // No user is signed in, redirect to login page
    window.location.href = "login.html";
  }
});

function displayUserInfo(user) {
  const userInfoDiv = document.getElementById('user-info');
  userInfoDiv.innerHTML = `Welcome, ${user.displayName || user.email}!`;
}

document.getElementById('post-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const content = document.getElementById('post-content').value;
  const user = auth.currentUser;

  db.collection("posts").add({
    content: content,
    author: user.displayName || user.email,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    document.getElementById('post-content').value = '';
    loadPosts();
  })
  .catch((error) => {
    console.error("Error adding post: ", error);
  });
});

function loadPosts() {
  const postsDiv = document.getElementById('posts');
  postsDiv.innerHTML = '';

  db.collection("posts").orderBy("createdAt", "desc").get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const post = doc.data();
        const postElement = document.createElement('div');
        postElement.innerHTML = `
          <p>${post.content}</p>
          <small>Posted by ${post.author} on ${post.createdAt.toDate().toLocaleString()}</small>
        `;
        postsDiv.appendChild(postElement);
      });
    })
    .catch((error) => {
      console.log("Error getting posts: ", error);
    });
}

document.getElementById('search-button').addEventListener('click', function() {
  const searchTerm = document.getElementById('search-input').value;
  const searchResultsDiv = document.getElementById('search-results');
  searchResultsDiv.innerHTML = '';

  db.collection("users")
    .where("username", ">=", searchTerm)
    .where("username", "<=", searchTerm + "\uf8ff")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const user = doc.data();
        const userElement = document.createElement('div');
        userElement.textContent = `${user.username} (${user.email})`;
        searchResultsDiv.appendChild(userElement);
      });
    })
    .catch((error) => {
      console.log("Error searching users: ", error);
    });
});

document.getElementById('logout').addEventListener('click', function() {
  auth.signOut().then(() => {
    window.location.href = "login.html";
  }).catch((error) => {
    console.log("Error signing out: ", error);
  });
});