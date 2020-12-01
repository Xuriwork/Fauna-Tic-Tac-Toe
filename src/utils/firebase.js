import firebase from 'firebase/app';
import '@firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyC3Fb0btmJ8gxO5FdjyA0g8Mz3vR-wXOoo",
    authDomain: "tic-tac-toe-60163.firebaseapp.com",
    databaseURL: "https://tic-tac-toe-60163.firebaseio.com",
    projectId: "tic-tac-toe-60163",
    storageBucket: "tic-tac-toe-60163.appspot.com",
    messagingSenderId: "23976713854",
    appId: "1:23976713854:web:94b05b651b1e5287a5422f"
};

firebase.initializeApp(firebaseConfig);

export default firebase;