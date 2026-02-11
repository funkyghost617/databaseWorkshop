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

navbar.innerHTML = `<header><a href="/pages/home.html">EVENTINEL</a></header>
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
    const todaysEventsDocs = await getDocs(query(collection(db, "events"), where("event_date", "==", currentDate.toISOString().slice(0, 10)), orderBy("event_time_start"))); 
    if (todaysEventsDocs.size == 0) {
        document.querySelector("#todays-events li:first-child").textContent = "no events scheduled for today";
    } else {
        document.querySelector("#todays-events li:first-child").remove();
        todaysEventsDocs.forEach((event) => {
            const eventPoint = document.createElement("li");
            eventPoint.setAttribute("event_id", event.id);
            eventPoint.textContent = `${event.data()["event_name"]}, ${event.data()["event_time_start"]}-${event.data()["event_time_end"]}`
            todaysEvents.appendChild(eventPoint);
            const eventInfoList = document.createElement("ul");
            const eventInfoPoint = document.createElement("li");
            eventInfoPoint.textContent = "...";
            eventInfoList.appendChild(eventInfoPoint);
            eventPoint.appendChild(eventInfoList);
            loadEventInfo(eventPoint, eventInfoPoint);
        })
    }
}
loadTodaysEvents();

async function loadEventInfo(eventPoint, eventInfoPoint) {
    const regisDocs = await getDocs(query(collection(db, "registrations"), where("event_id", "==", eventPoint.getAttribute("event_id"))));
    eventInfoPoint.textContent = `${regisDocs.size} registrants`;
}

const dayNames = document.querySelector("#day-names");
weekdays.forEach(day => {
    const dayName = document.createElement("div");
    dayName.textContent = day;
    dayNames.appendChild(dayName);
})

const monthDisplay = document.querySelector("#month-display");
const yearDisplay = document.querySelector("#year-display");
for (let i = currentDate.getFullYear() - 2; i < currentDate.getFullYear() + 3; i++) {
    const yearOption = document.createElement("option");
    yearOption.value = i;
    yearOption.textContent = i;
    yearDisplay.appendChild(yearOption);
}
monthDisplay.value = currentDate.getMonth();
yearDisplay.value = currentDate.getFullYear();

const backwardScroll = document.querySelector("#backward");
const forwardScroll = document.querySelector("#forward");
const jumpToToday = document.querySelector("#jump-to-today");
backwardScroll.addEventListener("click", (e) => {
    if (monthDisplay.value > 0) {
        monthDisplay.value--;
    } else {
        monthDisplay.value = 11;
        yearDisplay.value--;
    }
    if (monthDisplay.value == currentDate.getMonth() && Number(yearDisplay.value) == currentDate.getFullYear()) {
        jumpToToday.setAttribute("disabled", "disabled");
    } else {
        jumpToToday.removeAttribute("disabled");
    }
    drawCalendar();
    populateCalendar();
})
forwardScroll.addEventListener("click", (e) => {
    if (monthDisplay.value < 11) {
        monthDisplay.value++;
    } else {
        monthDisplay.value = 0;
        yearDisplay.value++;
    }
    if (monthDisplay.value  == currentDate.getMonth() && Number(yearDisplay.value) == currentDate.getFullYear()) {
        jumpToToday.setAttribute("disabled", "disabled");
    } else {
        jumpToToday.removeAttribute("disabled");
    }
    drawCalendar();
    populateCalendar();
})
jumpToToday.addEventListener("click", (e) => {
    if (jumpToToday.getAttribute("disabled") == "disabled") {
        return;
    } else {
        monthDisplay.value = currentDate.getMonth();
        yearDisplay.value = currentDate.getFullYear();
        jumpToToday.setAttribute("disabled", "disabled");
        drawCalendar();
        populateCalendar();
    }
})
monthDisplay.addEventListener("change", (e) => {
    if (monthDisplay.value  == currentDate.getMonth() && Number(yearDisplay.value) == currentDate.getFullYear()) {
        jumpToToday.setAttribute("disabled", "disabled");
    } else {
        jumpToToday.removeAttribute("disabled");
    }
    drawCalendar();
    populateCalendar();
})
yearDisplay.addEventListener("change", (e) => {
    if (monthDisplay.value  == currentDate.getMonth() && yearDisplay.value == currentDate.getFullYear()) {
        jumpToToday.setAttribute("disabled", "disabled");
    } else {
        jumpToToday.removeAttribute("disabled");
    }
    drawCalendar();
    populateCalendar();
})

const activeCalendar = document.querySelector("#active-calendar");
drawCalendar();
populateCalendar();

// month must be zero-indexed in function call
function getNumDays(year, month) {
    return new Date(year, month + 1, 0).getDate();
}
async function drawCalendar() {
    activeCalendar.innerHTML = "";
    const selectedMonth = Number(monthDisplay.value);
    const selectedYear = Number(yearDisplay.value);
    const startingDay = new Date(selectedYear, selectedMonth, 1).getDay();
    for (let i = 0; i < startingDay; i++) {
        const monthCell = document.createElement("div");
        monthCell.classList.add("monthCell");
        monthCell.textContent = "EMPTY CELL";
        activeCalendar.appendChild(monthCell);
    }

    for (let i = 0; i < getNumDays(selectedYear, selectedMonth); i++) {
        const monthCell = document.createElement("div");
        monthCell.textContent = (i + 1).toString();
        monthCell.setAttribute("day", (i + 1).toString());
        monthCell.classList.add("monthCell");
        activeCalendar.appendChild(monthCell);
    };
}
async function populateCalendar() {
    let selectedMonth = String(Number(monthDisplay.value) + 1);
    const selectedYear = Number(yearDisplay.value);
    if (selectedMonth.length == 1) {
        selectedMonth = `0${selectedMonth}`;
    }
    const monthCells = document.querySelectorAll(".monthCell");
    monthCells.forEach(async (cell) => {
        let day = cell.getAttribute("day");
        if (day == null) {
            return;
        }
        if (day.length == 1) {
            day = `0${day}`;
        }
        const cellEvents = await getDocs(query(collection(db, "events"), where("event_date", "==", `${selectedYear}-${selectedMonth}-${day}`), orderBy("event_time_start", "asc")));
        cellEvents.forEach((event) => {
            const eventBlock = document.createElement("div");
            let eventTimeStart = event.data()["event_time_start"];
            let eventTimeArray = eventTimeStart.split(":");
            let displayHour = Number(eventTimeArray[0]) % 12 == 0 ? "12" : Number(eventTimeArray[0]) % 12;
            let displayMin = eventTimeArray[1] == "00" ? "" : `:${eventTimeArray[1]}`;
            let displayTime = `${displayHour}${displayMin}${Number(eventTimeArray[0]) > 11 ? "pm" : "am"}`;
            eventBlock.textContent = `${displayTime}, ${event.data()["event_name"]}`;
            cell.appendChild(eventBlock);
            /*eventBlock.addEventListener("click", (e) => {
                window.location.href = `/pages/events/${event.id}`;
            })*/
        })
        if (cellEvents.size > 3) {
            const overflowCells = document.querySelectorAll(`.monthCell[day="${cell.getAttribute("day")}"] > div:nth-child(n + 3)`);
            overflowCells.forEach((cell) => {
                cell.hidden = true;
            })
            const showMoreBlock = document.createElement("div");
            showMoreBlock.textContent = "show more";
            showMoreBlock.classList.add("showMoreBtn");
            cell.appendChild(showMoreBlock);
            showMoreBlock.addEventListener("click", (e) => {
                if (cell.classList.contains("selectedDay")) {
                    showMoreBlock.textContent = "show more";
                    cell.classList.remove("selectedDay");
                    overflowCells.forEach((cell) => {
                        cell.hidden = true;
                    })
                } else {
                    showMoreBlock.textContent = "show less"
                    cell.classList.add("selectedDay");
                    overflowCells.forEach((cell) => {
                        cell.hidden = false;
                    })
                }
            })
        }
    });
}

