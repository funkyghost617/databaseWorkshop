import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore, collection, doc, getDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAW8lBFXWUg7tfYbvod3-khX1oGXrnshKk",
    authDomain: "databaseworkshop.firebaseapp.com",
    projectId: "databaseworkshop",
    storageBucket: "databaseworkshop.firebasestorage.app",
    messagingSenderId: "115769503478",
    appId: "1:115769503478:web:1e9c80f6a479035b3b86d7",
    measurementId: "G-71JJBGLQXX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const studentsTable = document.querySelector("#students-table");

function renderStudent(doc) {
    let li = document.createElement("li");
    let studentID = document.createElement("span");
    let firstName = document.createElement("span");
    let lastName = document.createElement("span");

    li.setAttribute("data-id", doc.id);
    studentID.textContent = doc.data()["student_id"];
    firstName.textContent = doc.data()["first_name"];
    lastName.textContent = doc.data()["last_name"];

    li.appendChild(studentID);
    li.appendChild(firstName);
    li.appendChild(lastName);

    studentsTable.appendChild(li);
};

const querySnapshot = await getDocs(collection(db, "students"));

querySnapshot.forEach((student) => {
    renderStudent(student);
});