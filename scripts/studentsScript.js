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
    let primaryEmail = document.createElement("td");
    let secondaryEmail = document.createElement("td");
    let tertiaryEmail = document.createElement("td");
    let applicationTerm = document.createElement("td");
    let dateOfBirth = document.createElement("td");
    let addressLine1 = document.createElement("td");
    let addressLine2 = document.createElement("td");
    let addressCity = document.createElement("td");
    let addressState = document.createElement("td");
    let addressCountry = document.createElement("td");
    let addressPostcode = document.createElement("td");

    student.setAttribute("data-id", doc.id);
    studentID.textContent = doc.data()["student_id"];
    firstName.textContent = doc.data()["first_name"];
    lastName.textContent = doc.data()["last_name"];
    primaryEmail.textContent = doc.data()["primary_email"];
    secondaryEmail.textContent = doc.data()["secondary_email"];
    tertiaryEmail.textContent = doc.data()["tertiary_email"];
    applicationTerm.textContent = doc.data()["application_term"];
    dateOfBirth.textContent = doc.data()["date_of_birth"];
    addressLine1.textContent = doc.data()["address_line1"];
    addressLine2.textContent = doc.data()["address_line2"];
    addressCity.textContent = doc.data()["address_city"];
    addressState.textContent = doc.data()["address_state"];
    addressCountry.textContent = doc.data()["address_country"];
    addressPostcode.textContent = doc.data()["address_postcode"];

    student.appendChild(studentID);
    student.appendChild(firstName);
    student.appendChild(lastName);
    student.appendChild(primaryEmail);
    student.appendChild(secondaryEmail);
    student.appendChild(tertiaryEmail);
    student.appendChild(applicationTerm);
    student.appendChild(dateOfBirth);
    student.appendChild(dateOfBirth);
    student.appendChild(addressLine1);
    student.appendChild(addressLine2);
    student.appendChild(addressCity);
    student.appendChild(addressState);
    student.appendChild(addressCountry);
    student.appendChild(addressPostcode);

    studentsTableBody.appendChild(student);
};

const querySnapshot = await getDocs(collection(db, "students"));

querySnapshot.forEach((student) => {
    renderStudent(student);
});