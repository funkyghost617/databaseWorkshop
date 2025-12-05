// initialize firestore connections
import { collection, doc, getDoc, getDocs, addDoc, query, orderBy, where } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { db }  from "./firebaseScript.js";

const studentQueries = await getDocs(query(collection(db, "queries"), orderBy("studentOrder", "asc")));
const eventQueries = await getDocs(query(collection(db, "queries"), orderBy("eventOrder", "asc")));
const activityQueries = await getDocs(query(collection(db, "queries"), orderBy("activityOrder", "asc")));
const regisQueries = await getDocs(query(collection(db, "queries"), orderBy("regisOrder", "asc")));

// manage page reset (clear conditions and other user input, clear internal query queue)
const resetBtn = document.querySelector("#reset-query-builder");
resetBtn.addEventListener("click", (e) => resetQueryBuilder());
function resetQueryBuilder() {
    conditions.innerHTML = "";
    tableSelect.value = "NO_SELECTION";
    tableSelect.disabled = false;
    addConditionBtn.hidden = true;
    mainTable = "";
    currentQueries = "";
    queryQueue = [];
}

async function displayConditions() {
    console.log(mainTable);
    const condition = document.createElement("div");
    conditions.appendChild(condition);
    const plainTextSelector = document.createElement("select");
    condition.appendChild(plainTextSelector);
    if (mainTable == "students") {
        currentQueries = studentQueries;
    } else if (mainTable == "events") {
        currentQueries = eventQueries;
    } else if (mainTable == "activities") {
        currentQueries = activityQueries;
    } else {
        currentQueries = regisQueries;
    }
    currentQueries.forEach((queryDoc) => {
        const queryOption = document.createElement("option");
        queryOption.value = queryDoc.id;
        queryOption.textContent = queryDoc.data()["plain_text"];
        plainTextSelector.appendChild(queryOption);
    });
    const userInput = document.createElement("input");
    userInput.type = "date";
    userInput.hidden = true;
    plainTextSelector.insertAdjacentElement("afterend", userInput);
    plainTextSelector.addEventListener("change", async (e) => {
        const plainTextSelection = await getDoc(doc(db, "queries", plainTextSelector.value));
        if (plainTextSelection.data()["parameter3"] == "askDate") {
            userInput.hidden = false;
        } else {
            userInput.hidden = true;
        }
    })
    const saveConditionBtn = document.createElement("button");
    saveConditionBtn.type = "button";
    saveConditionBtn.setAttribute("class", "save");
    saveConditionBtn.textContent = "save condition";
    condition.appendChild(saveConditionBtn);
    saveConditionBtn.addEventListener("click", async (e) => {
        if (saveConditionBtn.getAttribute("class") == "save") {
            plainTextSelector.disabled = true;
            userInput.disabled = true;
            saveConditionBtn.textContent = "delete condition";
            saveConditionBtn.setAttribute("class", "delete");
            queueCondition(await getDoc(doc(db, "queries", plainTextSelector.value)));
        } else {
            condition.remove();
            queryQueue = queryQueue.filter(obj => obj.id != plainTextSelector.value);
        }
    });
}

async function queueCondition(queryDoc) {
    let queryObject = {
        id: queryDoc.id,
        "parameter1": queryDoc.data()["parameter1"],
        "parameter2": queryDoc.data()["parameter2"],
        "parameter3": queryDoc.data()["parameter3"],
    };

    queryQueue.push(queryObject);
}

let mainTable = "";
let currentQueries = "";
let queryQueue = [];

const main = document.querySelector("main");
const tableSelect = document.querySelector("#table-select");
tableSelect.value = "NO_SELECTION";
tableSelect.addEventListener("change", async (e) => {
    e.preventDefault();
    if (tableSelect.value != "NO_SELECTION") {
        tableSelect.disabled = true;
        mainTable = tableSelect.value;
        displayConditions();
        addConditionBtn.hidden = false;
    }
})


async function processQuery(snap, col) {
    console.log(snap.data(), col);
    const parameter1 = snap.data()["parameter1"];
    const parameter2 = snap.data()["parameter2"];
    let parameter3 = snap.data()["parameter3"];
    if (parameter3 == "askDate") {
        parameter3 = prompt("Please enter a date in the format YYYY-MM-DD:")
    } 
    const fetchFrom = snap.data()["fetchFrom"];
    if (fetchFrom) {
        const fetchSnap = await getDocs(query(collection(db, fetchFrom), where(parameter1, parameter2, parameter3), orderBy(parameter1, "asc")));
        let fetchIDs = [];
        fetchSnap.forEach((fetchDoc) => {
            fetchIDs.push(fetchDoc.id);
        })
        const resultOfFetch = await getDocs(query(collection(db, col), where("event_id", "in", fetchIDs)));
        resultOfFetch.forEach((fetchResult) => {
            console.log(fetchResult);
        })
    } else if (parameter3 == "DUPLICATES") {
        const tableSnap = await getDocs(query(collection(db, col), orderBy(parameter1, "asc")));
        let param1All = [];
        tableSnap.forEach((reflexiveDoc) => {
            param1All.push(reflexiveDoc.data()[parameter1]);
        });
        let testArray = [...param1All];
        let param1Filter = [];
        for (let i = 0; i < param1All.length; i++) {
            testArray.shift();
            if (testArray.includes(param1All[i])) {
                param1Filter.push(param1All[i]);
            }
        }
        const reflexiveResultSnap = await getDocs(query(collection(db, col), where(parameter1, parameter2, param1Filter)));
        reflexiveResultSnap.forEach((reflexiveResult) => {
            console.log(reflexiveResult);
        })
    }
};


// manage population of conditions div
const conditions = document.querySelector("#conditions");
const addConditionBtn = document.querySelector("#add-condition");
addConditionBtn.addEventListener("click", (e) => {
    displayConditions();
})

const createQueryBtn = document.querySelector("#create-query");
createQueryBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (conditions.childElementCount == 0) {
        alert("cannot create query without any conditions");
    } else {
        let confirmation = confirm("are you sure you want to create a query with these conditions?");
        if (confirmation) {
            alert("query created");
        }
    }
})