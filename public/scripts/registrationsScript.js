// initialize firestore connections
import { collection, doc, getDoc, getDocs, addDoc, query, orderBy, where } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { db }  from "./firebaseScript.js";

// create references to registrations table and table body
const registrationsTable = document.querySelector("#registrations-table");
const registrationsTableBody = document.querySelector("#registrations-table-body");

// process each document which results from the firebase query
async function renderRegistration(regis) {
    const studentRef = doc(db, "students", regis.data()["student_id"]);
    const student = await getDoc(studentRef);
    const eventRef = doc(db, "events", regis.data()["event_id"]);
    const event = await getDoc(eventRef);
    let registrationRow = document.createElement("tr");
    registrationRow.setAttribute("data-id", regis.id);
    let studentID = document.createElement("td");
    let eventID = document.createElement("td");
    let studentName = document.createElement("td");
    let eventName = document.createElement("td");
    let eventDate = document.createElement("td");
    let registrationDate = document.createElement("td");
    studentID.textContent = regis.data()["student_id"];
    eventID.textContent = regis.data()["event_id"];
    studentName.textContent = `${student.data()["last_name"]}, ${student.data()["first_name"]}`;
    eventName.textContent = event.data()["event_name"];
    eventDate.textContent = event.data()["event_date"];
    registrationDate.textContent = regis.data()["registration_date"];
    registrationRow.append(studentID, eventID, studentName, eventName, eventDate, registrationDate);
    registrationsTableBody.appendChild(registrationRow);
    let activityCounter = 1
    while (regis.data()[`activity${activityCounter}`] != undefined) {
        let activityData = document.createElement("td");
        const activityRef = doc(db, "activities", regis.data()[`activity${activityCounter}`]);
        const activityDoc = await getDoc(activityRef);
        activityData.textContent = activityDoc.data()["activity_name"];
        registrationRow.appendChild(activityData);
        activityCounter++;
    }
};

// query full registrations table from firebase, then run renderRegistration for each resulting document
const registrationsRef = collection(db, "registrations");
const q = query(registrationsRef, orderBy("registration_date", "asc"));
const querySnapshot = await getDocs(q);
querySnapshot.forEach((registration) => {
    renderRegistration(registration);
});

/*// control display of current registration modal
const eventModal = document.querySelector("#event-modal");
const closeEventModal = document.querySelector("#close-modal-btn");
closeEventModal.addEventListener("click", () => {
    eventModal.style.setProperty("display", "none");
});

// create references to text elements within modal window
const nameAndIDModal = document.querySelector("#name-and-id");
const timeModal = document.querySelector("#time");
const locationModal = document.querySelector("#location");
const typeModal = document.querySelector("#type");
const recordLinkModal = document.querySelector("#link-to-record");

// create click event listeners on each visible row to populate modal window elements with relevant data
const dataRows = document.querySelectorAll("tbody tr");
dataRows.forEach(row => {
    row.addEventListener("click", () => {
        nameAndIDModal.textContent = `${row.children[0].textContent}
Event ID: ${row.getAttribute("data-id")}`;
        timeModal.textContent = `Time start: ${row.children[2].textContent}
Time end: ${row.children[3].textContent}`;
        locationModal.textContent = `Location: ${row.children[4].textContent}`;
        typeModal.textContent = `Event type: ${row.children[5].textContent}`;
        const docID = row.getAttribute("data-id");
        recordLinkModal.setAttribute("href", "./events/" + docID);
        eventModal.style.setProperty("display", "block");
    })
});*/