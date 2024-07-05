import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'



const firebaseConfig = {
    apiKey: "AIzaSyAdnqOqLtIBhdrf2dp3AxbvIs5TMTKg-5Q",
    authDomain: "orderrace-e1845.firebaseapp.com",
    projectId: "orderrace",
    storageBucket: "orderrace-e1845.appspot.com",
    messagingSenderId: "1015772696682",
    appId: "1:1015772696682:web:d4c3ac8c787780687ffa13",
    measurementId: "G-T37DNGN9Z1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//initialize firebase auth
const auth = getAuth(app);


export { app, auth }