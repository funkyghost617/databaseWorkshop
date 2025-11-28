// initialize firestore connections
import { collection, doc, getDoc, deleteDoc, getDocs, addDoc, query, orderBy, where } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { db }  from "./firebaseScript.js";

// create references to students table and table body
const studentsTable = document.querySelector("#students-table");
const studentsTableBody = document.querySelector("#students-table-body");

/* create array of strings corresponding to the property names of student documents in firebase
    -- this array is used to create the table elements based on the query results submitted by the user
*/
const studentAttributes = ["student_id", "first_name", "last_name", "primary_email", "secondary_email", "tertiary_email", "application_term", "date_of_birth", "address_line1", "address_line2", "address_city", "", "address_state", "address_country", "address_postcode"];

// process each document which results from the firebase query
function renderStudent(doc) {
    let student = document.createElement("tr");
    student.setAttribute("data-id", doc.id);
    let rowElements = [];
    studentAttributes.forEach(element => {
        rowElements.push(document.createElement("td"));
    })
    for (let i = 0; i < rowElements.length; i++) {
        rowElements[i].textContent = doc.data()[studentAttributes[i]];
        student.appendChild(rowElements[i]);
    };
    studentsTableBody.appendChild(student);
};

// query full students table from firebase, then run renderStudent for each resulting document
const studentsRef = collection(db, "students");
const q = query(studentsRef, orderBy("student_id", "asc"));
const querySnapshot = await getDocs(q);
querySnapshot.forEach((student) => {
    renderStudent(student);
});

// control display of current student modal
const studentModal = document.querySelector("#student-modal");
const closeStudentModal = document.querySelector("#close-modal-btn");
closeStudentModal.addEventListener("click", () => {
    studentModal.style.setProperty("display", "none");
});

// create references to text elements within modal window
const nameAndIDModal = document.querySelector("#name-and-id");
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
});

// process raw csv text into new student documents
const importCSVText = document.querySelector("#import-students-csv");
const importCSVBtn = document.querySelector("#submit-import-students-csv");
const successMessage = document.querySelector("#success-message");
importCSVBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let importArray = importCSVText.value.split("\n");
    importArray.forEach(student => {
        let studentArray = student.split(",");
        addDoc(collection(db, "students"), {
            "student_id": Number(studentArray[0]),
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