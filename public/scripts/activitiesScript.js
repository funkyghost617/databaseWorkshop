// initialize firestore connections
import { collection, doc, getDoc, getDocs, addDoc, query, orderBy, where } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { db }  from "./firebaseScript.js";

// create references to activities table and table body
const activitiesTable = document.querySelector("#activities-table");
const activitiesTableBody = document.querySelector("#activities-table-body");

/* create array of strings corresponding to the property names of activity documents in firebase
    -- this array is used to create the table elements based on the query results submitted by the user
*/
// process each document which results from the firebase query
function renderActivity(act) {
    let activity = document.createElement("tr");
    activity.setAttribute("data-id", act.id);
    let parentEventID = document.createElement("td");
    let activityDate = document.createElement("td");
    let activityName = document.createElement("td");
    let activityTimeStart = document.createElement("td");
    let activityTimeEnd = document.createElement("td");
    let activityLocation = document.createElement("td");
    let activityType = document.createElement("td");
    const eventRef = doc(db, "events", act.data()["parent_event_id"]);
    const event = getDoc(eventRef);
    parentEventID.textContent = act.data()["parent_event_id"];
    //activityDate.textContent = event.data()["event_date"];
    activityName.textContent = act.data()["activity_name"];
    activityTimeStart.textContent = act.data()["activity_time_start"];
    activityTimeEnd.textContent = act.data()["activity_time_end"];
    activityLocation.textContent = act.data()["activity_location"];
    activityType.textContent = act.data()["activity_type"];
    activity.appendChild(parentEventID);
    activity.appendChild(activityDate);
    activity.appendChild(activityName);
    activity.appendChild(activityTimeStart);
    activity.appendChild(activityTimeEnd);
    activity.appendChild(activityLocation);
    activity.appendChild(activityType);
    activitiesTableBody.appendChild(activity);
};

// query full activities table from firebase, then run renderActivity for each resulting document
const activitiesRef = collection(db, "activities");
const q = query(activitiesRef);
const querySnapshot = await getDocs(q);
querySnapshot.forEach((activity) => {
    renderActivity(activity);
});

// control display of current activity modal
const activityModal = document.querySelector("#activity-modal");
const closeActivityModal = document.querySelector("#close-modal-btn");
closeActivityModal.addEventListener("click", () => {
    activityModal.style.setProperty("display", "none");
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

// process raw csv text into new activity documents
const importCSVText = document.querySelector("#import-activities-csv");
const importCSVBtn = document.querySelector("#submit-import-activities-csv");
const successMessage = document.querySelector("#success-message");
importCSVBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let importArray = importCSVText.value.split("\n");
    importArray.forEach(activity => {
        let activityArray = activity.split(",");
        addDoc(collection(db, "activities"), {
            "parent_event_id": activityArray[0],
            "activity_name": activityArray[1],
            "activity_time_start": activityArray[2],
            "activity_time_end": activityArray[3],
            "activity_location": activityArray[4],
            "activity_type": activityArray[5],
        });
    });
    successMessage.textContent = `${importArray.length} activities added to database!`;
    console.log(`${importArray.length} activities added to database!`);
    importCSVText.value = "";
});