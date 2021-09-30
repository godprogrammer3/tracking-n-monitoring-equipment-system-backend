var firebase = require('firebase/app');

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAF-1vDsV-NU7ihvojiw7uLYhbico8pA6g',
  authDomain: 'trackingandmonitoringsystem.firebaseapp.com',
  projectId: 'trackingandmonitoringsystem',
  storageBucket: 'trackingandmonitoringsystem.appspot.com',
  messagingSenderId: '896495303491',
  appId: '1:896495303491:web:c085781b02c5c5968bcdf6',
};

const app = firebase.initializeApp(firebaseConfig);
var auth = require('firebase/auth');
const sign = auth.getAuth();
const GoogleAuthProvider = auth.GithubAuthProvider;
const provider = new GoogleAuthProvider();
auth
  .signInWithPopup(sign, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    console.log('user:', user);
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.log('error:', error);
    // ...
  });
