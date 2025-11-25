//initialize firestore connections
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore, collection, doc, getDoc, getDocs, addDoc, query, orderBy, where } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { app } from "./firebaseScript.js";

const db = getFirestore(app);

const hrefArray = window.location.href.split("/");
console.log(hrefArray);
const docID = hrefArray[hrefArray.length-1];
console.log(docID);

const docRef = doc(db, "students", docID);
const currentStudent = await getDoc(docRef);
console.log(currentStudent);

const idContainer = document.querySelector("#student_id");
idContainer.textContent = currentStudent.data()["student_id"];