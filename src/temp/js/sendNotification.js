var firebase = require('firebase/app');

const firebaseConfig = {
  apiKey: 'AIzaSyAF-1vDsV-NU7ihvojiw7uLYhbico8pA6g',
  authDomain: 'trackingandmonitoringsystem.firebaseapp.com',
  projectId: 'trackingandmonitoringsystem',
  storageBucket: 'trackingandmonitoringsystem.appspot.com',
  messagingSenderId: '896495303491',
  appId: '1:896495303491:web:c085781b02c5c5968bcdf6',
};

const app = firebase.initializeApp(firebaseConfig);
var message = require('firebase/messaging');
const messaging = message.getMessaging();
async function mess () {
  messaging.requestPermission()
    .then(function () {
      console.log('Have permission');
    })
    .then()
    .catch(function (err) {
      console.log('Error Occured.');
    })
}
/*const messaging = message.getMessaging();
messaging.getToken(messaging, { vapidKey: '<YOUR_PUBLIC_VAPID_KEY_HERE>' }).then((currentToken) => {
    if (currentToken) {
      // Send the token to your server and update the UI if necessary
      console.log(currentToken);
    } else {
      // Show permission request UI
      console.log('No registration token available. Request permission to generate one.');
      // ...
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // ...
  });*/
