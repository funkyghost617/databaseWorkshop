// initialize firestore connections
import { collection, doc, getDoc, getDocs, addDoc, query, orderBy, where } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { auth, db }  from "./firebaseScript.js";

const navbar = document.querySelector("#navbar");

const studentQueries = await getDocs(query(collection(db, "queries"), orderBy("studentOrder", "asc")));
const eventQueries = await getDocs(query(collection(db, "queries"), orderBy("eventOrder", "asc")));
const activityQueries = await getDocs(query(collection(db, "queries"), orderBy("activityOrder", "asc")));
const regisQueries = await getDocs(query(collection(db, "queries"), orderBy("regisOrder", "asc")));
const builderContainer = document.querySelector("#builder-container");
builderContainer.hidden = false;
const tableSelect = document.querySelector("#table-select");
tableSelect.disabled = false;

// manage page reset (clear conditions and other user input, clear internal query queue)
const resetBtn = document.querySelector("#reset-query-builder");
resetBtn.addEventListener("click", (e) => resetQueryBuilder());
function resetQueryBuilder() {
    conditions.innerHTML = "";
    tableSelect.value = "NO_SELECTION";
    tableSelect.disabled = false;
    mainTable = "";
    currentQueries = "";
    whereText.hidden = true;
}

async function displayConditions(parentBtn) {
    const condition = document.createElement("div");
    parentBtn.insertAdjacentElement("beforebegin", condition);
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
    const blankSelection = document.createElement("option");
    plainTextSelector.appendChild(blankSelection);
    currentQueries.forEach((queryDoc) => {
        const queryOption = document.createElement("option");
        queryOption.value = queryDoc.id;
        queryOption.textContent = queryDoc.data()["plain_text"];
        plainTextSelector.appendChild(queryOption);
    });
    const userInput = document.createElement("input");
    userInput.hidden = true;
    plainTextSelector.insertAdjacentElement("afterend", userInput);
    plainTextSelector.addEventListener("change", async (e) => {
        plainTextSelector.setAttribute("query-doc-id", plainTextSelector.value);
        userInput.value = "";
        plainTextSelector.setAttribute("user-input-value", userInput.value);
        if (plainTextSelector.value == "") {
            return;
        }
        const plainTextSelection = await getDoc(doc(db, "queries", plainTextSelector.value)); 
        if (plainTextSelection.data()["parameter3"] == "askDate") {
            const dateType = document.createElement("select");
            const relativeOption = document.createElement("option");
            relativeOption.textContent = "relative";
            const absoluteOption = document.createElement("option");
            absoluteOption.textContent = "absolute";
            dateType.append(absoluteOption, relativeOption);
            plainTextSelector.insertAdjacentElement("afterend", dateType);
            userInput.type = "date";
            dateType.addEventListener("change", (e) => {
                if (dateType.value == "absolute") {
                    userInput.type = "date";
                } else {
                    userInput.type = "number";
                }
            })
            plainTextSelector.addEventListener("change", (e) => {
                e.preventDefault();
                dateType.remove();
                userInput.hidden = true;
            });
            userInput.hidden = false;
        } else if (plainTextSelection.data()["parameter3"] == "askString") {
            userInput.type = "text";
            userInput.hidden = false;
        } else if (plainTextSelection.data()["parameter3"] == "askNum") {
            userInput.type = "number";
            userInput.hidden = false;
        } else {
            userInput.hidden = true;
        }
        userInput.addEventListener("change", (e) => {
            plainTextSelector.setAttribute("user-input-value", userInput.value);
        })
    })
}

async function createCompoundQueryAlt() {
    let compoundQuery = {};
    const currentDate = new Date();
    compoundQuery["query_name"] = `untitled query`;
    compoundQuery["date-created"] = currentDate.toISOString().split("T")[0];
    compoundQuery["created-by"] = navbar.getAttribute("data-uid");
    compoundQuery["main-table"] = mainTable;
    const conditionSets = document.querySelectorAll("#conditions > div");
    let queryIDs = [];
    let userInputs = [];
    let disjunctionTracker = [];
    for (let i = 1; i < conditionSets.length + 1; i++) {
        const condSet = document.querySelectorAll(`#conditions > div:nth-child(${i * 2}) > div > select:first-child`);
        condSet.forEach(condition => {
            queryIDs.push(condition.getAttribute("query-doc-id"));
            if (condition.getAttribute("user-input-value") != "") userInputs.push(condition.getAttribute("user-input-value"));
        })
        disjunctionTracker.push(condSet.length);
    }
    compoundQuery["query-array"] = queryIDs;
    compoundQuery["user-input"] = userInputs;
    if (disjunctionTracker.length > 1) {
        compoundQuery["disjunction-tracker"] = disjunctionTracker;
    }
    await addDoc(collection(db, "queries", "compound_queries", "saved_queries"), compoundQuery);
    console.log("compound query saved to collection!");
}

let mainTable = "";
let currentQueries = "";

// manage population of conditions div
const conditions = document.querySelector("#conditions");

const whereText = document.querySelector("#where-text");
tableSelect.value = "NO_SELECTION";
tableSelect.addEventListener("change", async (e) => {
    e.preventDefault();
    if (tableSelect.value != "NO_SELECTION") {
        tableSelect.disabled = true;
        mainTable = tableSelect.value;
        const addCondSetBtn = document.createElement("button");
        addCondSetBtn.setAttribute("id", "add-cond-set-btn");
        addCondSetBtn.textContent = "add condition set";
        conditions.appendChild(addCondSetBtn);
        addCondSetBtn.addEventListener("click", (e) => {
            createConditionSet();
        })
        createConditionSet();
        whereText.hidden = false;
    }
})




function createConditionSet() {
    const conditionSet = document.createElement("div");
    const addCondSetBtn = document.querySelector("#add-cond-set-btn");
    addCondSetBtn.insertAdjacentElement("beforebegin", conditionSet);
    const conditionSetLabel = document.createElement("p");
    const conditionSetLabelText = document.createElement("span");
    conditionSetLabelText.textContent = `condition set ${document.querySelectorAll("#conditions > div").length}`;
    conditionSetLabel.appendChild(conditionSetLabelText);
    conditionSet.insertAdjacentElement("beforebegin", conditionSetLabel);
    /*const deleteCondSetBtn = document.createElement("button");
    deleteCondSetBtn.textContent = "delete condition set";
    deleteCondSetBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (document.querySelectorAll("#conditions > p").length == 1) {
            alert("cannot have a query with no conditions");
        } else {
            conditionSetLabel.remove();
            conditionSet.remove();
            for (let i = 0; i < document.querySelectorAll("#conditions > p span").length; i++) {
                document.querySelectorAll("#conditions > p span")[i].textContent = `condition set ${i + 1}`;
            }
        }
    });
    conditionSetLabel.insertAdjacentElement("beforeend", deleteCondSetBtn);*/ //commented out bc current condition deletion process does not remove conditions from internal queue   
    const addConditionBtn = document.createElement("button");
    conditionSet.appendChild(addConditionBtn);
    addConditionBtn.type = "button";
    addConditionBtn.classList.add("add-condition-btn");
    const addCondImg = document.createElement("img");
    addCondImg.src = "../../icons/plusSign.svg";
    addCondImg.width = "30";
    addConditionBtn.appendChild(addCondImg);
    const addCondSpan = document.createElement("span");
    addCondSpan.textContent = "add a condition";
    addConditionBtn.appendChild(addCondSpan);
    addConditionBtn.addEventListener("click", (e) => {
        e.preventDefault();
        displayConditions(addConditionBtn);
    })
    displayConditions(addConditionBtn);
}


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

const createQueryBtn = document.querySelector("#create-query");
createQueryBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    if (conditions.childElementCount == 0) {
        alert("cannot create query without any conditions");
    } else {
        let confirmation = confirm("are you sure you want to create a query with these conditions?");
        if (confirmation) {
            createCompoundQueryAlt().then(alert("query created"));
        }
    }
})