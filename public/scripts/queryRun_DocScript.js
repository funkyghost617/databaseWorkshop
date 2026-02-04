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

async function runQuerySet(results, setSize) {
    
    let queryResult = [];
    // start of first iteration
    let queryPart = queryParts[queryArrayIndex++]
    const param1 = queryPart["parameter1"];
    const param2 = queryPart["parameter2"];
    if (!specialParam3Values.includes(queryPart["parameter3"])) {
        const everything = allTables.find((ele) => ele[0] == mainTable)[1];
        everything.forEach(Edoc => {
            if (applyOperator(param2, Edoc.data()[param1], Edoc.data()[queryPart["parameter3"]])) {
                let elementObj = Edoc.data();
                elementObj["id"] = Edoc.id;
                queryResult.push(elementObj);
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
                let elementObj = ele.data();
                elementObj["id"] = ele.id;
                queryResult.push(elementObj);
                console.log(applyOperator(param2, ele.data()[param1], dupeValues));
            }
        })
    } else if (queryPart["parameter3"] == "askDate") {
        const everything = allTables.find((ele) => ele[0] == mainTable)[1];
        console.log(everything.size);
        everything.forEach(Edoc => {
            if (applyOperator(param2, `${Edoc.data()[param1]}T00:00:00Z`, `${userInputArray[userInputIndex]}T00:00:00Z`)) {
                let elementObj = Edoc.data();
                elementObj["id"] = Edoc.id;
                queryResult.push(elementObj);
            }
        })
        userInputIndex++;
    } else {
        const everything = allTables.find((ele) => ele[0] == mainTable)[1];
        everything.forEach(Edoc => {
            if (applyOperator(param2, Edoc.data()[param1], userInputArray[userInputIndex])) {
                let elementObj = Edoc.data();
                elementObj["id"] = Edoc.id;
                queryResult.push(elementObj);
            }
        })
        userInputIndex++;
    }
    // end of first iteration
    for (let i = 0; i < setSize - 1; i++) {
        let newResult = [];
        queryPart = queryParts[queryArrayIndex++]
        const param1 = queryPart["parameter1"];
        const param2 = queryPart["parameter2"];
        if (!specialParam3Values.includes(queryPart["parameter3"])) {
            const everything = queryResult;
            everything.forEach(Edoc => {
                if (applyOperator(param2, Edoc[param1], Edoc[queryPart["parameter3"]])) {
                    newResult.push(Edoc);
                }
            })
        } else if (param2 == "in" && queryPart["parameter3"] == "DUPLICATES") {
            const everything = queryResult;
            let allValues = [];
            let dupeValues = [];
            everything.forEach(Edoc => {
                if (applyOperator(param2, Edoc[param1], allValues)) {
                    dupeValues.push(Edoc[param1]);
                };
                allValues.push(Edoc[param1]);
            })
            everything.forEach((ele) => {
                if (applyOperator(param2, ele[param1], dupeValues)) {
                    newResult.push(ele);
                }
            })
        } else if (queryPart["parameter3"] == "askDate") {
            const everything = queryResult;
            everything.forEach(Edoc => {
                if (applyOperator(param2, `${Edoc[param1]}T00:00:00Z`, `${userInputArray[userInputIndex]}T00:00:00Z`)) {
                    newResult.push(Edoc);
                }
            })
            userInputIndex++;
        } else {
            const everything = queryResult;
            everything.forEach(Edoc => {
                if (applyOperator(param2, Edoc[param1], userInputArray[userInputIndex])) {
                    newResult.push(Edoc);
                }
            })
            userInputIndex++;
        }
        queryResult = newResult;
    }
    results.push(queryResult);
}

let queryArrayIndex = 0;
const runBtn = document.querySelector("#run-btn");
runBtn.hidden = false;
runBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    runBtn.hidden = true;
    const resultsTable = document.createElement("table");
    const resultsHeader = document.createElement("thead");
    const queryCats = currentQuery.data()["display-categories"];
    let queryCatsArray = [];
    queryCats.forEach(cat => {
        const headCell = document.createElement("th");
        headCell.textContent = cat.split(" -- ")[1];
        queryCatsArray.push(cat.split(" -- ")[1]);
        headCell.setAttribute("table-and-cat", cat);
        resultsHeader.appendChild(headCell);
    });
    resultsTable.appendChild(resultsHeader);
    userInputIndex = 0;
    disjunctionTracker = currentQuery.data()["disjunction-tracker"];

    let queryResults = [];
    for (let i = 0; i < disjunctionTracker.length; i++) {
        runQuerySet(queryResults, disjunctionTracker[i]);
    }
    console.log(queryResults);

    let finalResults = [];
    for (let h = 0; h < queryResults.length; h++) {
        for (let i = 0; i < queryResults[h].length; i++) {
            let isInFinalArray = false;
            for (let j = 0; j < finalResults.length; j++) {
                if (finalResults[j]["id"] == queryResults[h][i]["id"]) {
                    isInFinalArray = true;
                }
            }
            if (!isInFinalArray) {
                finalResults.push(queryResults[h][i]);
            }
        }
    }
    console.log(finalResults);

    const tableBody = document.createElement("tbody");
    resultsTable.appendChild(tableBody);
    for (let i = 0; i < finalResults.length; i++) {
        const tableRow = document.createElement("tr");
        for (let j = 0; j < queryCats.length; j++) {
            const dataCell = document.createElement("td");
            if (queryCats[j].split(" -- ")[0] == mainTable) {
                dataCell.textContent = finalResults[i][queryCats[j].split(" -- ")[1]];
            } else {
                const relevantTable = allTables.find((ele) => ele[0] == queryCats[j].split(" -- ")[0])[1];
                let relevantDoc;
                relevantTable.forEach((ele) => {
                    if (ele.id == finalResults[i][`${queryCats[j].split(" -- ")[0].slice(0, -1)}_id`]) {
                        relevantDoc = ele.data();
                        return;
                    }
                })
                dataCell.textContent = relevantDoc[queryCats[j].split(" -- ")[1]];
            }
            tableRow.appendChild(dataCell);
        }
        tableRow.setAttribute("id", finalResults[i]["id"]);
        tableBody.appendChild(tableRow);
        tableRow.addEventListener("click", (e) => {
            const modalWindow = document.createElement("div");
            resultsTable.insertAdjacentElement("afterend", modalWindow);
            modalWindow.classList.add("modal-window");
            const modalContent = document.createElement("div");
            const modalLink = document.createElement("p");
            const modalLinkA = document.createElement("a");
            modalLink.appendChild(modalLinkA);
            modalContent.appendChild(modalLink);
            modalLinkA.textContent = "Go to record page";
            if (mainTable == "registrations") {
                const relevantTable = allTables.find((ele) => ele[0] == "events")[1];
                relevantTable.forEach((ele) => {
                    if (ele.id == finalResults[i]["event_id"]) {
                        modalLinkA.setAttribute("href", `/pages/events/${ele.id}`);
                        return;
                    }
                })
            } else {
                modalLinkA.setAttribute("href", `/pages/${mainTable}/${tableRow.getAttribute("id")}`);
            }
            for (let j = 0; j < queryCatsArray.length; j++) {
                const dataPara = document.createElement("p");
                dataPara.textContent = `${queryCatsArray[j]}: ${tableRow.querySelector(`td:nth-child(${j + 1})`).textContent}`;
                modalContent.appendChild(dataPara);
            }
            modalWindow.appendChild(modalContent);
            modalWindow.addEventListener("click", (e) => {
                modalWindow.remove();
            })
        })
    }
    runBtn.insertAdjacentElement("afterend", resultsTable);
})