//initialize firestore connections
import { collection, doc, getDoc, getDocs, addDoc, query, orderBy, where, limit } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { db } from "./firebaseScript.js";

const hrefArray = window.location.href.split("/");
console.log(hrefArray);
const docID = hrefArray[hrefArray.length-2];
console.log(docID);

const docRef = doc(db, "events", docID);
const currentEvent = await getDoc(docRef);

const mainHeader = document.querySelector("#event_id");
mainHeader.textContent = `Registering for ${currentEvent.data()["event_name"]} on ${currentEvent.data()["event_date"]}
Event ID: ${docID}`;

const registrationForm = document.querySelector("#registration-form");
const processMsg = document.querySelector("#process-message");

const selectStudent = document.querySelector("#select-student");
const studentList = collection(db, "students");
const orderedQ = query(studentList, orderBy("last_name", "asc"));
const studentsRef = await getDocs(orderedQ);
studentsRef.forEach((doc) => {
    const studentOption = document.createElement("option");
    studentOption.setAttribute("value", doc.id);
    studentOption.textContent = `${doc.data()["last_name"]}, ${doc.data()["first_name"]}`;
    selectStudent.appendChild(studentOption);
});

const relevantActivities = query(collection(db, "activities"), where("parent_event_id", "==", currentEvent.id), orderBy("activity_time_start", "asc"), limit(5));
const activitiesSnapshot = await getDocs(relevantActivities);
console.log(activitiesSnapshot.docs.length);
if (!activitiesSnapshot.empty) {
    const activityList = document.createElement("ul");
    activityList.setAttribute("id", "activity-list")
    registrationForm.appendChild(activityList);
    activitiesSnapshot.forEach((doc) => {
        const activityLabel = document.createElement("label")
        activityLabel.textContent = `${doc.data()["activity_name"]}, ${doc.data()["activity_time_start"]}-${doc.data()["activity_time_end"]}`;
        const activityCheckbox = document.createElement("input");
        activityCheckbox.setAttribute("type", "checkbox");
        activityCheckbox.setAttribute("value", doc.id);
        activityLabel.appendChild(activityCheckbox);
        activityList.appendChild(activityLabel);
    });
};
const checkboxGroup = document.querySelectorAll("#activity-list input");
console.log(checkboxGroup);


const submitBtn = document.querySelector("#submit-registration");
submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (selectStudent.value == "NO_SELECTION") {
        console.log("please select a student");
    } else {
        processMsg.textContent = "processing...";
        let newRegistration = { "student_id": selectStudent.value, "event_id": docID };
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        if (month.length < 2) month = `0${month}`;
        const day = currentDate.getDate();
        if (day.length < 2) day = `0${day}`;
        newRegistration["registration_date"] = `${year}-${month}-${day}`;
        if (checkboxGroup.length != 0) {
            let activityNumber = 0;
            checkboxGroup.forEach((input) => {
                if (input.checked) {
                    newRegistration[`activity${++activityNumber}`] = input.value;
                }
            })
        }
        addRegistration(newRegistration);
    }
})

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

async function addRegistration(regis) {
    await addDoc(collection(db, "registrations"), regis);
    console.log("registration added!");
    processMsg.innerHTML = `Registration added! If you are not redirected within a few seconds, click <a href="./../${docID}">here</a>`;
    await delay(2000);
    window.location.href = `./../${docID}`;
};