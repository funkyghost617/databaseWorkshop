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

const idContainer = document.querySelector("#event_id");
idContainer.textContent = currentEvent.id;

const activitiesList = document.querySelector("#relevant-activities");
const relevantActivities = query(collection(db, "activities"), where("parent_event_id", "==", currentEvent.id), orderBy("activity_time_start", "asc"), limit(5));
const activitiesSnapshot = await getDocs(relevantActivities);
activitiesSnapshot.forEach((doc) => {
    let activity = document.createElement("li");
    activity.textContent = `${doc.data()["activity_name"]}, ${doc.data()["activity_time_start"]}-${doc.data()["activity_time_end"]}`;
    activitiesList.appendChild(activity);
});