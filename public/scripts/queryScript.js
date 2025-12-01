// initialize firestore connections
import { collection, doc, getDoc, getDocs, addDoc, query, orderBy, where } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { db }  from "./firebaseScript.js";

const tableSelect = document.querySelector("#table-select");
const addConditionBtn = document.querySelector("#add-condition");
tableSelect.addEventListener("change", (e) => {
    e.preventDefault();
    if (tableSelect.value == "NO_SELECTION") {
        addConditionBtn.disabled = true;
        return;
    }
    if (tableSelect.value == "students") {
        addConditionBtn.disabled = false;
        addConditionBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            const fieldSelect = document.createElement("select");
            fieldSelect.appendChild(document.createElement("option"));
            const studentFieldsRef = query(collection(db, "queries", "parameters", "student_fields"), orderBy("order", "asc"));
            const studentFields = await getDocs(studentFieldsRef);
            studentFields.forEach((field) => {
                console.log(field.data()["order"])
                const fieldOption = document.createElement("option");
                fieldOption.value = field.data()["type"];
                fieldOption.textContent = field.data()["type"];
                fieldSelect.appendChild(fieldOption);
            })
            addConditionBtn.insertAdjacentElement("afterend", fieldSelect);
        })
    } else {
        addConditionBtn.disabled = true;
    }
})