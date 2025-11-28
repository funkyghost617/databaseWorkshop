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
    eventsTableBody.appendChild(student);
};

// query full students table from firebase, then run renderStudent for each resulting document
const eventsRef = collection(db, "events");
const q = query(eventsRef, orderBy("event_date", "asc"));
const querySnapshot = await getDocs(q);
querySnapshot.forEach((event) => {
    renderStudent(event);
});

// control display of current student modal
const eventModal = document.querySelector("#event-modal");
const closeEventModal = document.querySelector("#close-modal-btn");
closeEventModal.addEventListener("click", () => {
    eventModal.style.setProperty("display", "none");
});

// create references to text elements within modal window
/*const nameAndIDModal = document.querySelector("#name-and-id");
const emailsModal = document.querySelector("#emails");
const addressModal = document.querySelector("#address");
const termAndDOBModal = document.querySelector("#term-and-dob");
const recordLinkModal = document.querySelector("#link-to-record");

// create click event listeners on each visible row to populate modal window elements with relevant data
const dataRows = document.querySelectorAll("tbody tr");
dataRows.forEach(row => {
    row.addEventListener("click", () => {
        nameAndIDModal.textContent = `${row.children[1].textContent} ${row.children[2].textContent}
ID: ${row.children[0].textContent}`;
        emailsModal.textContent = `${row.children[3].textContent}
${row.children[4].textContent}
${row.children[5].textContent}`;
        addressModal.textContent = `${row.children[8].textContent}
${row.children[9].textContent}
${row.children[10].textContent}
${row.children[11].textContent}
${row.children[12].textContent}
${row.children[13].textContent}`;
        termAndDOBModal.textContent = `Application term: ${row.children[6].textContent}
DOB: ${row.children[7].textContent}`;
        const docRef = row.getAttribute("data-id");
        recordLinkModal.setAttribute("href", "./students/" + docRef);
        studentModal.style.setProperty("display", "block");
    })
});*/

// process raw csv text into new student documents
const importCSVText = document.querySelector("#import-events-csv");
const importCSVBtn = document.querySelector("#submit-import-events-csv");
const successMessage = document.querySelector("#success-message");
importCSVBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let importArray = importCSVText.value.split("\n");
    importArray.forEach(event => {
        let eventArray = event.split(",");
        addDoc(collection(db, "students"), {
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