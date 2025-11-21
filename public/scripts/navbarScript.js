import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { app } from "./firebaseScript.js";

const auth = getAuth(app);
const navbar = document.getElementById("navbar");
const body = document.querySelector("body");
import loadScreen from "./loadScreenScript.js";
body.appendChild(loadScreen);

//check for lack of authentication
auth.onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = "https://funkyghost617backend--databaseworkshop.us-central1.hosted.app/";
    } else {
        console.log("you are logged in!");
        console.log(user);
        loadScreen.style.setProperty("display", "none");
    }
});

navbar.innerHTML = `<header><a href="./home.html">database workshop</a></header>
    <p><a href="./students.html">students</a></p>
    <p><a href="./events.html">events</a></p>
    <p><a href="./sub-events.html">sub-events</a></p>
    <p><a href="./registrations.html">registrations</a></p>
    <p><a href="#" id="sign-out-btn">sign out</a></p>`;

const signoutBtn = document.querySelector("#sign-out-btn");
signoutBtn.addEventListener("click", (e) => {
    e.preventDefault();

    signOut(auth).then(() => {
        window.location.href = "https://funkyghost617backend--databaseworkshop.us-central1.hosted.app/";
    });
});

