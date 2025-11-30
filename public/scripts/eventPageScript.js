//initialize firestore connections
import { collection, doc, getDoc, getDocs, addDoc, query, orderBy, where, limit } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { db } from "./firebaseScript.js";

const hrefArray = window.location.href.split("/");
console.log(hrefArray);
const docID = hrefArray[hrefArray.length-1];
console.log(docID);

const docRef = doc(db, "events", docID);
const currentEvent = await getDoc(docRef);
console.log(currentEvent);

const idContainer = document.querySelector("#event_name_date_id");
idContainer.textContent = `${currentEvent.data()["event_name"]} ${currentEvent.data()["event_date"]} (${docID})`;

const activitiesList = document.querySelector("#relevant-activities");
const relevantActivities = query(collection(db, "activities"), where("parent_event_id", "==", currentEvent.id), orderBy("activity_time_start", "asc"), limit(5));
const activitiesSnapshot = await getDocs(relevantActivities);
activitiesSnapshot.forEach((doc) => {
    let activity = document.createElement("li");
    activity.textContent = `${doc.data()["activity_name"]}, ${doc.data()["activity_time_start"]}-${doc.data()["activity_time_end"]}`;
    activitiesList.appendChild(activity);
});

const registerLink = document.querySelector("#register-link");
registerLink.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = `./${currentEvent.id}/register`;
})

const studentsTable = document.querySelector("#students-body");
const nonePlaceholder = document.querySelector("#none-placeholder");
const noneText = document.querySelector("#none-placeholder:first-child");

const registeredStudentsRef = query(collection(db, "registrations"), where("event_id", "==", docID));
const registrationsSnapshot = await getDocs(registeredStudentsRef);
if (!registrationsSnapshot.empty) {
    nonePlaceholder.remove();
    registrationsSnapshot.forEach(async (regis) => {
        const studentRow = document.createElement("tr");
        const studentName = document.createElement("td");
        const studentRef = doc(db, "students", regis.data()["student_id"]);
        const student = await getDoc(studentRef);
        studentName.textContent = `${student.data()["last_name"]}, ${student.data()["first_name"]}`;
        const registrationDate = document.createElement("td");
        registrationDate.textContent = regis.data()["registration_date"];
        studentRow.appendChild(studentName);
        studentRow.appendChild(registrationDate);
        studentsTable.appendChild(studentRow);
    });
} else {
    noneText.textContent = `No students currently registered`;
};