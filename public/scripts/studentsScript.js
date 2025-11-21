//initialize firestore connections
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore, collection, doc, getDoc, getDocs, addDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
const firebaseConfig = {
    REMOVED: "API key",
    authDomain: "databaseworkshop.firebaseapp.com",
    projectId: "databaseworkshop",
    storageBucket: "databaseworkshop.firebasestorage.app",
    messagingSenderId: "115769503478",
    appId: "1:115769503478:web:1e9c80f6a479035b3b86d7",
    measurementId: "G-71JJBGLQXX"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//connect javascript to students.html
const studentsTable = document.querySelector("#students-table");
const studentsTableBody = document.querySelector("#students-table-body");

//process each document in the students table from firebase
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
    student.appendChild(addressLine1);
    student.appendChild(addressLine2);
    student.appendChild(addressCity);
    student.appendChild(addressState);
    student.appendChild(addressCountry);
    student.appendChild(addressPostcode);

    studentsTableBody.appendChild(student);
};

//get latest version of students table from firebase
const studentsRef = collection(db, "students");
const q = query(studentsRef, orderBy("student_id", "asc"));
const querySnapshot = await getDocs(q);

querySnapshot.forEach((student) => {
    renderStudent(student);
});

//process raw csv text into new student documents
const importCSVText = document.querySelector("#import-students-csv");
const importCSVBtn = document.querySelector("#submit-import-students-csv");
const successMessage = document.querySelector("#success-message");
importCSVBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let importArray = importCSVText.value.split("\n");
    importArray.forEach(student => {
        let studentArray = student.split(",");
        addDoc(collection(db, "students"), {
            "student_id": studentArray[0],
            "first_name": studentArray[1],
            "last_name": studentArray[2],
            "primary_email": studentArray[3],
            "secondary_email": studentArray[4],
            "tertiary_email": studentArray[5],
            "application_term": studentArray[6],
            "date_of_birth": studentArray[7],
            "address_line1": studentArray[8],
            "address_line2": studentArray[9],
            "address_city": studentArray[10],
            "address_state": studentArray[11],
            "address_country": studentArray[12],
            "address_postcode": studentArray[13]
        });
    });
    successMessage.textContent = `${importArray.length} students added to database!`;
    console.log(`${importArray.length} students added to database!`);
    importCSVText.value = "";
});