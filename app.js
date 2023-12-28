// Initialize Firebase with your configuration
const firebaseConfig = {
    apiKey: "AIzaSyCqpLV4do4TqpLdmtqlJG2uNI8_aND6zGY",
    authDomain: "clinic-cffe4.firebaseapp.com",
    databaseURL: "https://clinic-cffe4-default-rtdb.firebaseio.com",
    projectId: "clinic-cffe4",
    storageBucket: "clinic-cffe4.appspot.com",
    messagingSenderId: "10463763649",
    appId: "1:10463763649:web:f60d6706b0ec91b99b0840"
  };
  firebase.initializeApp(firebaseConfig);

// Function to handle login
function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Logged in as:", user.email);
      window.location.href = "role-selection.html";
      // You can redirect to another page or perform other actions here
    })
    .catch((error) => {
      console.error("Login error:", error.message);
    });
}

// Function to handle sign-up
function signup() {
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Signed up as:", user.email);
      
      // Store user profile in the database
      const usersRef = firebase.database().ref("users");
      const newUserRef = usersRef.push();
      newUserRef.set({
        name: name,
        email: email
      });
      console.log("Redirecting to dashboard...");
      window.location.href = "role-selection.html";// You can redirect to another page or perform other actions here
    })
    .catch((error) => {
      console.error("Sign up error:", error.message);
    });
}

// Function to handle password reset
function forgotPassword() {
  const email = prompt("Enter your email address:");
  
  if (email) {
    firebase.auth().sendPasswordResetEmail(email)
      .then(() => {
        console.log("Password reset email sent.");
      })
      .catch((error) => {
        console.error("Password reset error:", error.message);
      });
  }
}
