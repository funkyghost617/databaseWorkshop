// initialize firestore connections
import { collection, doc, getDoc, getDocs, addDoc, query, orderBy, where } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { db }  from "./firebaseScript.js";

// create references to events table and table body
const eventsTable = document.querySelector("#events-table");
const eventsTableBody = document.querySelector("#events-table-body");

/* create array of strings corresponding to the property names of event documents in firebase
    -- this array is used to create the table elements based on the query results submitted by the user
*/
const eventAttributes = ["event_name", "event_date", "event_time_start", "event_time_end", "event_location", "event_type"];

// process each document which results from the firebase query
function renderEvent(doc) {
    let event = document.createElement("tr");
    event.setAttribute("data-id", doc.id);
    let rowElements = [];
    eventAttributes.forEach(element => {
        rowElements.push(document.createElement("td"));
    })
    for (let i = 0; i < rowElements.length; i++) {
        rowElements[i].textContent = doc.data()[eventAttributes[i]];
        event.appendChild(rowElements[i]);
    };
    eventsTableBody.appendChild(event);
};

// query full events table from firebase, then run renderEvent for each resulting document
const eventsRef = collection(db, "events");
const q = query(eventsRef, orderBy("event_date", "asc"));
const querySnapshot = await getDocs(q);
querySnapshot.forEach((event) => {
    renderEvent(event);
});

// control display of current event modal
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
});

// process raw csv text into new event documents
const importCSVText = document.querySelector("#import-events-csv");
const importCSVBtn = document.querySelector("#submit-import-events-csv");
const successMessage = document.querySelector("#success-message");
importCSVBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let importArray = importCSVText.value.split("\n");
    importArray.forEach(event => {
        let eventArray = event.split(",");
        addDoc(collection(db, "events"), {
            "event_name": eventArray[0],
            "event_date": eventArray[1],
            "event_time_start": eventArray[2],
            "event_time_end": eventArray[3],
            "event_location": eventArray[4],
            "event_type": eventArray[5],
        });
    });
    successMessage.textContent = `${importArray.length} events added to database!`;
    console.log(`${importArray.length} events added to database!`);
    importCSVText.value = "";
});