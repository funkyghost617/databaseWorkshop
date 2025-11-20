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
const studentsTableBody = document.querySelector("#students-table-body");

function renderStudent(doc) {
    let student = document.createElement("tr");
    let studentID = document.createElement("td");
    let firstName = document.createElement("td");
    let lastName = document.createElement("td");

    student.setAttribute("data-id", doc.id);
    studentID.textContent = doc.data()["student_id"];
    firstName.textContent = doc.data()["first_name"];
    lastName.textContent = doc.data()["last_name"];

    student.appendChild(studentID);
    student.appendChild(firstName);
    student.appendChild(lastName);

    studentsTableBody.appendChild(student);
};

const querySnapshot = await getDocs(collection(db, "students"));

querySnapshot.forEach((student) => {
    renderStudent(student);
});