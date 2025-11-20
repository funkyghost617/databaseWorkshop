import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAW8lBFXWUg7tfYbvod3-khX1oGXrnshKk",
    authDomain: "databaseworkshop.firebaseapp.com",
    projectId: "databaseworkshop",
    storageBucket: "databaseworkshop.firebasestorage.app",
    messagingSenderId: "115769503478",
    appId: "1:115769503478:web:1e9c80f6a479035b3b86d7",
    measurementId: "G-71JJBGLQXX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const navbar = document.getElementById("navbar");

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
        window.location.href = "../index.html";
    });
});