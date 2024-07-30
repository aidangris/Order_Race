import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, set, onValue, update } from "firebase/database";



const firebaseConfig = {
    apiKey: "AIzaSyAdnqOqLtIBhdrf2dp3AxbvIs5TMTKg-5Q",
    authDomain: "orderrace-e1845.firebaseapp.com",
    projectId: "orderrace",
    storageBucket: "orderrace-e1845.appspot.com",
    messagingSenderId: "1015772696682",
    appId: "1:1015772696682:web:d4c3ac8c787780687ffa13",
    measurementId: "G-T37DNGN9Z1",
    databaseURL: 'https://orderrace-e1845-default-rtdb.firebaseio.com'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//initialize firebase auth
const auth = getAuth(app);
const db = getDatabase(app);
//const usersRef = ref(db, '/users');


function writeScoreboard(name, scoreboard) {
    set(ref(db, 'users/' + name), {
        scoreboard: scoreboard
    });
}

function writeDailyChallenge(name, gamemode, diff, order) {
    console.log("writing daily challenge " + name);
    set(ref(db, 'daily_challenge/' + name), {
        gamemode: gamemode,
        difficulty: diff,
        order: order,
        scoreboard: "Be the first person on the scoreboard today!"
    });
}

function writeDCscoreboard(name, sb) {
    console.log("writing daily challenge " + sb + " to " + name + " scoreboard");
    update(ref(db, 'daily_challenge/' + name), {

        scoreboard: sb
    });
}

function getDailyChallenge(name) {
    const gmRef = ref(db, 'daily_challenge/' + name + '/gamemode');
    const diffRef = ref(db, 'daily_challenge/' + name + '/difficulty');
    const orderRef = ref(db, 'daily_challenge/' + name + '/order');
    const sbRef = ref(db, 'daily_challenge/' + name + '/scoreboard');


    let arr = [gmRef, diffRef, orderRef, sbRef];

    return arr;
}

function getScoreboard(name) {
    const lettersRef = ref(db, 'users/' + name + '/scoreboard/Letters');
    const numbersRef = ref(db, 'users/' + name + '/scoreboard/Numbers');
    const colorsRef = ref(db, 'users/' + name + '/scoreboard/Colors');
    const phdRef = ref(db, 'users/' + name + '/scoreboard/PHD');

    let arr = [lettersRef, numbersRef, colorsRef, phdRef];

    return arr;
}

export { app, auth, db, writeScoreboard, writeDCscoreboard, getScoreboard, writeDailyChallenge, getDailyChallenge }