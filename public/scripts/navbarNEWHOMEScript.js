import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { collection, doc, getDoc, getDocs, addDoc, query, orderBy, where } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { app, db } from "./firebaseScript.js";

const auth = getAuth(app);
const navbar = document.getElementById("navbar");
const body = document.querySelector("body");
const loadScreen = document.querySelector(".loadScreen");

//check for lack of authentication
auth.onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = "https://funkyghost617backend--databaseworkshop.us-central1.hosted.app/";
    } else if (!user.emailVerified && !window.location.href.includes("account")) {
        window.location.href = "./account.html";
    } else {
        console.log("you are logged in!");
        navbar.setAttribute("data-uid", user.uid);
        loadScreen.style.setProperty("display", "none");
        const welcomeName = document.querySelector("#username");
        welcomeName.textContent = user.displayName;
        const welcomePic = document.querySelector("#welcome > img");
        welcomePic.setAttribute("src", `./../images/${user.uid}.jpg`);
    }
});

navbar.innerHTML = `<header><a href="/pages/home.html">CONCIERGE</a></header>
    <button type="button" id="old-navlinks-btn">show old navlinks</button>
    <div id="old-navlinks">
        <p><a href="/pages/students.html">students</a></p>
        <p><a href="/pages/events.html">events</a></p>
        <p><a href="/pages/activities.html">activities</a></p>
        <p><a href="/pages/registrations.html">registrations</a></p>
        <p><a href="/pages/query.html">query</a></p>
        <p><a href="/pages/account.html">account</a></p>
        <p><a href="#" id="sign-out-btn">sign out</a></p>
    </div>`;

const oldNavlinksDiv = document.querySelector("#old-navlinks");
oldNavlinksDiv.hidden = true;
const oldNavlinksBtn = document.querySelector("#old-navlinks-btn");
oldNavlinksBtn.addEventListener("click", (e) => {
    e.preventDefault();
    oldNavlinksDiv.hidden = !oldNavlinksDiv.hidden;
})

const signoutBtn = document.querySelector("#sign-out-btn");
signoutBtn.addEventListener("click", (e) => {
    e.preventDefault();

    signOut(auth).then(() => {
        window.location.href = "/";
    });
});

/* navlinks anchors */
/*const messagingBtn = document.querySelector("#messaging");
messagingBtn.addEventListener("click", (e) => {
    window.location.href = "/pages/messaging.html";
})
const queryModeBtn = document.querySelector("#query-mode");
queryModeBtn.addEventListener("click", (e) => {
    window.location.href = "/pages/query.html";
})
const adminBtn = document.querySelector("#admin");
adminBtn.addEventListener("click", (e) => {
    window.location.href = "/pages/admin.html";
})
const myAccountBtn = document.querySelector("#my-account");
myAccountBtn.addEventListener("click", (e) => {
    window.location.href = "/pages/account.html";
})*/

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const currentDate = new Date();
const today = currentDate.getDate().toString();
let dateSuffix;
if (today.at(-1) == "1") {
    dateSuffix = "st";
} else if (today.at(-1) == "2") {
    dateSuffix = "nd";
} else if (today.at(-1) == "3") {
    dateSuffix = "rd";
} else {
    dateSuffix = "th";
}
const dateDisplay = document.querySelector("#current-date > p");
dateDisplay.textContent = `${weekdays[currentDate.getDay()]}, ${months[currentDate.getMonth()]} ${today}${dateSuffix}`;
const todaysEvents = document.querySelector("#todays-events");
async function loadTodaysEvents() {
    const todaysEventsDocs = await getDocs(query(collection(db, "events"), where("event_date", "==", "2026-02-24"), orderBy("event_time_start"))); //currentDate.toISOString().slice(0, 10)
    if (todaysEventsDocs.size == 0) {
        document.querySelector("#todays-events li:first-child").textContent = "no events scheduled for today";
    } else {
        document.querySelector("#todays-events li:first-child").remove();
        todaysEventsDocs.forEach((event) => {
            const eventPoint = document.createElement("li");
            eventPoint.textContent = `${event.data()["event_name"]}, ${event.data()["event_time_start"]}-${event.data()["event_time_end"]}`
            todaysEvents.appendChild(eventPoint);
        })
    }
}
loadTodaysEvents();

