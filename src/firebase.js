import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyAjh68-c4GZRRzyx82kxehN1Ohz4iojEMg",
    authDomain: "comments-devreactigor.firebaseapp.com",
    databaseURL: "https://comments-devreactigor.firebaseio.com",
    projectId: "comments-devreactigor",
    storageBucket: "comments-devreactigor.appspot.com",
    messagingSenderId: "1010210403623"
  };
  firebase.initializeApp(config);
/*Exportando o banco de dados */
  export const database = firebase.database();
  export const auth = firebase.auth();
  