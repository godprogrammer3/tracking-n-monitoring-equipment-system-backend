var firebaseConfig = {
  apiKey: 'AIzaSyB7oEYDje93lJI5bA1VKNPX9NVqqcubP1Q',
  authDomain: 'fir-auth-dcb9f.firebaseapp.com',
  projectId: 'fir-auth-dcb9f',
  storageBucket: 'fir-auth-dcb9f.appspot.com',
  messagingSenderId: '793102669717',
  appId: '1:793102669717:web:ff4c646e5b2242f518c89c',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

async function signIn() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const user = await firebase
    .auth()
    .signInWithEmailAndPassword(email, password);
  if (user) {
    console.log('token:', user.getIdToken());
  } else {
    console.log('sign in failed.');
  }
}
