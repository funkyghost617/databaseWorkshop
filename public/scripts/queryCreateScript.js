// initialize firestore connections
import { collection, doc, getDoc, getDocs, addDoc, query, orderBy, where } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { auth, db }  from "./firebaseScript.js";

/* all query options are loaded before the builder interface is shown
    -- the first group of promises load the applicable lists of queries for each table
    -- builderContainer (the element containing all the creation elements) is unhidden after the query lists are loaded
*/
const studentQueries = await getDocs(query(collection(db, "queries"), orderBy("studentOrder", "asc")));
const eventQueries = await getDocs(query(collection(db, "queries"), orderBy("eventOrder", "asc")));
const activityQueries = await getDocs(query(collection(db, "queries"), orderBy("activityOrder", "asc")));
const regisQueries = await getDocs(query(collection(db, "queries"), orderBy("regisOrder", "asc")));
const builderContainer = document.querySelector("#builder-container");
builderContainer.hidden = false;

// manage page reset (clear conditions and other user input)
const resetBtn = document.querySelector("#reset-query-builder");
resetBtn.addEventListener("click", (e) => resetQueryBuilder());
function resetQueryBuilder() {
    conditions.innerHTML = "";
    tableSelect.value = "NO_SELECTION";
    tableSelect.disabled = false;
    mainTable = "";
    currentQueries = "";
    whereText.hidden = true;
    refreshCats();
}

const tableSelect = document.querySelector("#table-select");    // selects the table being queried ("students", "events", etc)
let mainTable = "";                                             // saves the value of tableSelect as a string      
let currentQueries = "";                                        // connects value of mainTable to list of queries loaded at runtime

// manage population of conditions
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
        refreshCats();
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
        refreshCats();
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

const createQueryBtn = document.querySelector("#create-query");
createQueryBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    if (conditions.childElementCount == 0) {
        alert("cannot create query without any conditions");
    } else {
        let confirmation = confirm("are you sure you want to create a query with these conditions?");
        if (confirmation) {
            createCompoundQuery().then(alert("query created"));
        }
    }
})

async function createCompoundQuery() {
    let compoundQuery = {};
    const currentDate = new Date();
    compoundQuery["query_name"] = `untitled query`;
    compoundQuery["date-created"] = currentDate.toISOString().split("T")[0];
    compoundQuery["created-by"] = document.querySelector("#navbar").getAttribute("data-uid");
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

    let displayCatsArray = [];
    const displayCondSets = document.querySelectorAll("#display-cats-div > div");
    for (let i = 0; i < displayCondSets.length; i++) {
        if (!displayCondSets[i].hidden) {
            const displayConditions = document.querySelectorAll(`#display-cats-div > div:nth-child(${i + 1}) > label > input`);
            displayConditions.forEach(inputEle => {
                if (inputEle.checked) {
                    displayCatsArray.push(`${catsArraySubheaders[i]} -- ${inputEle.getAttribute("id")}`);
                }
            })
        }
    }
    compoundQuery["display-categories"] = displayCatsArray;
    
    const newQuery = await addDoc(collection(db, "queries", "compound_queries", "saved_queries"), compoundQuery);
    console.log("compound query saved to collection! redirecting to query page");
    window.location.href = `./run/${newQuery.id}`;
}

const displayCatsDiv = document.querySelector("#display-cats-div");
let studentsCats;
const studentsCatsQ = await getDoc(doc(db, "queries", "display_categories", "saved_categories", "students"));
let eventsCats;
const eventsCatsQ = await getDoc(doc(db, "queries", "display_categories", "saved_categories", "events"));
let activitiesCats;
const activitiesCatsQ = await getDoc(doc(db, "queries", "display_categories", "saved_categories", "activities"));
let regisCats;
const regisCatsQ = await getDoc(doc(db, "queries", "display_categories", "saved_categories", "registrations"));
const catsArraySubheaders = ["students", "events", "activities", "registrations"];
const catsArray = [studentsCats, eventsCats, activitiesCats, regisCats];
const catsArrayQ = [studentsCatsQ, eventsCatsQ, activitiesCatsQ, regisCatsQ];
function refreshCats() {
    if (mainTable == "") {
        displayCatsDiv.innerHTML = "";
        return;
    } else if (displayCatsDiv.innerHTML == "") {
        for (let i = 0; i < catsArrayQ.length; i++) {
            const cats = catsArrayQ[i].data()["cats"];
            const catsPlainText = catsArrayQ[i].data()["cats-plain-text"];
            const catsSection = document.createElement("div");
            catsSection.setAttribute("table-name", catsArraySubheaders[i]);
            catsSection.textContent = catsSection.getAttribute("table-name");
            for (let j = 0; j < cats.length; j++) {
                const catLabel = document.createElement("label");
                catLabel.setAttribute("for", cats[j]);
                catLabel.textContent = catsPlainText[j];
                const catCheckbox = document.createElement("input");
                catCheckbox.setAttribute("type", "checkbox");
                catCheckbox.setAttribute("id", cats[j]);
                catLabel.appendChild(catCheckbox);
                catsSection.appendChild(catLabel);
                catsSection.hidden = true;
            };
            displayCatsDiv.appendChild(catsSection);
        }
    }
    const displayCondSets = document.querySelectorAll("#display-cats-div > div");
    displayCondSets.forEach(set => {
        set.hidden = true;
        if (set.getAttribute("table-name") == mainTable || mainTable == "registrations") {
            set.hidden = false;
        } 
        if (set.getAttribute("table-name") == "events" && mainTable == "activities") {
            set.hidden = false;
        }
    })
    const conditionSets = document.querySelectorAll("#conditions > div");
    for (let i = 1; i < conditionSets.length + 1; i++) {
        const condSet = document.querySelectorAll(`#conditions > div:nth-child(${i * 2}) > div > select:first-child`);
        condSet.forEach(condition => {
            const selectedCond = condition.getAttribute("query-doc-id");
            currentQueries.forEach(queryDoc => {
                if (queryDoc.id == selectedCond) {
                    if (queryDoc.data()["fetchFrom"] != undefined) {
                        document.querySelector(`#display-cats-div [table-name="${queryDoc.data()["fetchFrom"]}"]`).hidden = false;
                    }
                    return;
                }
            })
        })
    }
}