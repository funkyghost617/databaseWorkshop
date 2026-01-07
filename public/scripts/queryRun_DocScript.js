//initialize firestore connections
import { collection, doc, getDoc, updateDoc, getDocs, addDoc, query, orderBy, where, limit } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { db } from "./firebaseScript.js";

const operations = {
    "<": (a, b) => a < b,
    "<=": (a, b) => a <= b,
    "==": (a, b) => a == b,
    ">": (a, b) => a > b,
    ">=": (a, b) => a >= b,
    "!=": (a, b) => a != b,
    "array-contains": (a, b) => a.all(b),
    "array-contains-any": (a, b) => a.some(b),
    "in": (a, b) => b.includes(a),
    "not-in": (a, b) => !b.includes(a)
}
function applyOperator(op, a, b) {
    if (op in operations) {
        return operations[op](a, b);
    } else {
        throw new Error(`Unsupported operator: ${op}`);
    }
}

const hrefArray = window.location.href.split("/");
console.log(hrefArray);
const docID = hrefArray[hrefArray.length-1];
console.log(docID);

const docRef = doc(db, "queries", "compound_queries", "saved_queries", docID);
const currentQuery = await getDoc(docRef);
console.log(currentQuery);
const mainTable = currentQuery.data()["main-table"]

const browserTitle = document.querySelector("title");
browserTitle.textContent = `${currentQuery.data()["query-name"]}${browserTitle.textContent}`;
console.log(currentQuery.data());

const creatorDoc = await getDoc(doc(db, "users", currentQuery.data()["created-by"]));

const nameContainer = document.querySelector("#query-name");
nameContainer.textContent = currentQuery.data()["query-name"];
const changeNameBtn = document.createElement("button");
changeNameBtn.setAttribute("type", "button");
changeNameBtn.textContent = "change name";
nameContainer.appendChild(changeNameBtn);
const changeNameInput = document.createElement("input");
changeNameInput.setAttribute("type", "text");
changeNameInput.setAttribute("placeholder", "enter new name here...");
changeNameInput.value = "";
changeNameBtn.addEventListener("click", (e) => {
    e.preventDefault();
    nameContainer.appendChild(changeNameInput);
    changeNameInput.addEventListener("keypress", async (e) => {
        if (e.key == "Enter" && changeNameInput.value != "") {
            await updateDoc(docRef, { "query-name": changeNameInput.value });
            window.location.reload();
        }
    })
})
const creationInfoCont = document.querySelector("#creation-info");
creationInfoCont.textContent = `Created on ${currentQuery.data()["date-created"]} by ${creatorDoc.data()["full_name"]}`;
const descPara = document.querySelector("#desc-para");
descPara.hidden = false;
const tableCont = document.querySelector("#main-table");
tableCont.textContent = mainTable;
const descList = document.querySelector("#query-desc");
const queryArray = currentQuery.data()["query-array"];
const userInputArray = currentQuery.data()["user-input"];
let userInputIndex = 0;
let disjunctionTracker = currentQuery.data()["disjunction-tracker"];
let disjunctionCounter = 0;
let queryParts = [];
for (let i = 0; i < queryArray.length; i++) {
    if (disjunctionTracker != undefined && disjunctionTracker[0] == disjunctionCounter) {
        disjunctionTracker.shift();
        const orItem = document.createElement("li");
        orItem.textContent = "OR";
        disjunctionCounter = 0;
        descList.appendChild(orItem);
    }
    const queryPart = await getDoc(doc(db, "queries", queryArray[i]));
    queryParts.push(queryPart.data());
    const plainText = queryPart.data()["plain_text"];
    const listItem = document.createElement("li");
    listItem.textContent = plainText;
    if (["askDate", "askString", "askNum"].includes(queryPart.data()["parameter3"])) {
        listItem.textContent = listItem.textContent + userInputArray[userInputIndex++];
    }
    descList.appendChild(listItem);
    disjunctionCounter++;
}

let studentsTable;
let eventsTable;
let activitiesTable;
let registrationsTable;
if (mainTable == "students") {
    studentsTable = await getDocs(collection(db, "students"));
} else if (mainTable == "events") {
    eventsTable = await getDocs(collection(db, "events"));
} else if (mainTable == "activities") {
    eventsTable = await getDocs(collection(db, "events"));
    activitiesTable = await getDocs(collection(db, "activities"));
} else {
    studentsTable = await getDocs(collection(db, "students"));
    eventsTable = await getDocs(collection(db, "events"));
    activitiesTable = await getDocs(collection(db, "activities"));
    registrationsTable = await getDocs(collection(db, "registrations"));
}
let allTables = [["students", studentsTable], ["events", eventsTable], ["activities", activitiesTable], ["registrations", registrationsTable]];
console.log(allTables);

const specialParam3Values = ["DUPLICATES","askDate", "askNum", "askString"];

async function runQuerySet(results) {
    
    let queryResult = [];
    // start of first iteration
    const queryPart = queryParts[0]
    const param1 = queryPart["parameter1"];
    const param2 = queryPart["parameter2"];
    if (!specialParam3Values.includes(queryPart["parameter3"])) {
        const everything = allTables.find((ele) => ele[0] == mainTable)[1];
        everything.forEach(Edoc => {
            if (applyOperator(param2, Edoc.data()[param1], Edoc.data()[param3])) {
                queryResult.push(Edoc.data());
            }
        })
    } else if (param2 == "in" && queryPart["parameter3"] == "DUPLICATES") {
        console.log("success");
        console.log(allTables);
        const everything = allTables.find((ele) => ele[0] == mainTable)[1];
        let allValues = [];
        let dupeValues = [];
        everything.forEach(Edoc => {
            if (applyOperator(param2, Edoc.data()[param1], allValues)) {
                dupeValues.push(Edoc.data()[param1]);
            };
            allValues.push(Edoc.data()[param1]);
        })
        console.log(dupeValues);
        everything.forEach((ele) => {
            if (applyOperator(param2, ele.data()[param1], dupeValues)) {
                queryResult.push(ele.data());
                console.log(applyOperator(param2, ele.data()[param1], dupeValues));
            }
        })
    } else if (queryPart["parameter3"] == "askDate") {
        const everything = allTables.find((ele) => ele[0] == mainTable)[1];
        console.log(everything.size);
        everything.forEach(Edoc => {
            if (applyOperator(param2, `${Edoc.data()[param1]}T00:00:00Z`, `${userInputArray[userInputIndex]}T00:00:00Z`)) {
                queryResult.push(Edoc.data());
            }
        })
        userInputIndex++;
    } else {
        const everything = allTables.find((ele) => ele[0] == mainTable)[1];
        everything.forEach(Edoc => {
            if (applyOperator(param2, Edoc.data()[param1], userInputArray[userInputIndex])) {
                queryResult.push(Edoc.data());
            }
        })
        userInputIndex++;
    }
    disjunctionCounter++;
    // end of first iteration
    let queryArrayIndex = 1;
    while (queryArray[queryArrayIndex] != undefined) {
        
        

        queryArrayIndex++;
    }
    
    results.push(queryResult);

}

const runBtn = document.querySelector("#run-btn");
runBtn.hidden = false;
runBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    runBtn.hidden = true;
    const resultsTable = document.createElement("table");
    const resultsHeader = document.createElement("thead");
    const queryCats = currentQuery.data()["display-categories"];
    queryCats.forEach(cat => {
        const headCell = document.createElement("th");
        headCell.textContent = cat.split(" -- ")[1];
        headCell.setAttribute("table-and-cat", cat);
        resultsHeader.appendChild(headCell);
    });
    resultsTable.appendChild(resultsHeader);
    userInputIndex = 0;
    disjunctionCounter = 0;
    disjunctionTracker = currentQuery.data()["disjunction-tracker"];

    let queryResults = [];
    runQuerySet(queryResults);

    // start of loop
    /*for (let i = 1; i < queryArray.length; i++) {
        if (disjunctionTracker != undefined && disjunctionTracker[0] == disjunctionCounter) {
            disjunctionTracker.shift();
            disjunctionCounter = 0;
            results.push(queryResult);
            return;
    }
    }*/
    // end of loop

    console.log(queryResults);
    const tableBody = document.createElement("tbody");
    resultsTable.appendChild(tableBody);
    for (let h = 0; h < queryResults.length; h++) {
        for (let i = 0; i < queryResults[h].length; i++) {
            const tableRow = document.createElement("tr");
            for (let j = 0; j < queryCats.length; j++) {
                const dataCell = document.createElement("td");
                if (queryCats[j].split(" -- ")[0] == mainTable) {
                    dataCell.textContent = queryResults[h][i][queryCats[j].split(" -- ")[1]];
                } else {
                    const relevantTable = allTables.find((ele) => ele[0] == queryCats[j].split(" -- ")[0])[1];
                    let relevantDoc;
                    relevantTable.forEach((ele) => {
                        if (ele.id == queryResults[h][i][`${queryCats[j].split(" -- ")[0].slice(0, -1)}_id`]) {
                            relevantDoc = ele.data();
                            return;
                        }
                    })
                    dataCell.textContent = relevantDoc[queryCats[j].split(" -- ")[1]];
                }
                tableRow.appendChild(dataCell);
            }
            tableBody.appendChild(tableRow);
        }
    }
    runBtn.insertAdjacentElement("afterend", resultsTable);
})