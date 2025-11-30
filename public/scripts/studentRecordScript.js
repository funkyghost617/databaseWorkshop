//initialize firestore connections
import { collection, doc, getDoc, getDocs, addDoc, query, orderBy, where } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { db } from "./firebaseScript.js";

const hrefArray = window.location.href.split("/");
console.log(hrefArray);
const docID = hrefArray[hrefArray.length-1];
console.log(docID);

const docRef = doc(db, "students", docID);
const currentStudent = await getDoc(docRef);
console.log(currentStudent);
let studentID = currentStudent.data()["student_id"];
let firstName = currentStudent.data()["first_name"];
let lastName = currentStudent.data()["last_name"];
let fullName = `${lastName}, ${firstName}`;
let fullAddress = `${currentStudent.data()["address_line1"]}${currentStudent.data()["address_line2"] ? "\n" + currentStudent.data()["address_line2"] : ""}
${currentStudent.data()["address_city"]}, ${currentStudent.data()["address_state"]} ${currentStudent.data()["address_postcode"]}`;
let emails = `${currentStudent.data()["primary_email"]}
${currentStudent.data()["secondary_email"]}
${currentStudent.data()["tertiary_email"]}`;

const idContainer = document.querySelector("#student_name_and_id");
idContainer.textContent = `${fullName} -- Record ${studentID} (${docID})`;

const addressContainer = document.querySelector("#full_address");
addressContainer.textContent = fullAddress;

const emailsContainer = document.querySelector("#emails");
emailsContainer.textContent = emails;

const registeredEventsList = document.querySelector("#registered-events");
const nonePlaceholder = document.querySelector("#none-placeholder");

const registrationsRefQ = query(collection(db, "registrations"), where("student_id", "==", docID));
const qSnap = await getDocs(registrationsRefQ);
if (!qSnap.empty) {
    nonePlaceholder.remove();
    qSnap.forEach(async (regis) => {
        const listItem = document.createElement("li");
        const eventRef = doc(db, "events", regis.data()["event_id"]);
        const eventDoc = await getDoc(eventRef);
        listItem.textContent = `${eventDoc.data()["event_name"]}, ${eventDoc.data()["event_date"]}`;
        registeredEventsList.appendChild(listItem);
        listItem.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = `../events/${eventDoc.id}`;
        })
    })
} else {
    nonePlaceholder.textContent = `This student is not currently registered for any events`;
}
