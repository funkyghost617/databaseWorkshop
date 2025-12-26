//initialize firestore connections
import { collection, doc, getDoc, getDocs, addDoc, query, orderBy, where, limit } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { db } from "./firebaseScript.js";

const hrefArray = window.location.href.split("/");
console.log(hrefArray);
const docID = hrefArray[hrefArray.length-1];
console.log(docID);

const docRef = doc(db, "queries", "compound_queries", "saved_queries", docID);
const currentQuery = await getDoc(docRef);
console.log(currentQuery);

const browserTitle = document.querySelector("title");
browserTitle.textContent = `${currentQuery.data()["query_name"]}${browserTitle.textContent}`;
console.log(currentQuery.data());

const creatorDoc = await getDoc(doc(db, "users", currentQuery.data()["created-by"]));

const nameContainer = document.querySelector("#query-name");
nameContainer.textContent = currentQuery.data()["query_name"];
const creationInfoCont = document.querySelector("#creation-info");
creationInfoCont.textContent = `Created on ${currentQuery.data()["date-created"]} by ${creatorDoc.data()["full_name"]}`;
const descPara = document.querySelector("#desc-para");
descPara.hidden = false;
const tableCont = document.querySelector("#main-table");
tableCont.textContent = currentQuery.data()["main-table"];
const descList = document.querySelector("#query-desc");
const queryArray = currentQuery.data()["query-array"];
const userInputArray = currentQuery.data()["user-input"];
let userInputIndex = 0;
const disjunctionTracker = currentQuery.data()["disjunction-tracker"];
let disjunctionCounter = 0;
for (let i = 0; i < queryArray.length; i++) {
    if (disjunctionTracker[0] == disjunctionCounter) {
        disjunctionTracker.shift();
        const orItem = document.createElement("li");
        orItem.textContent = "OR";
        disjunctionCounter = 0;
        descList.appendChild(orItem);
    }
    const queryPart = await getDoc(doc(db, "queries", queryArray[i]));
    const plainText = queryPart.data()["plain_text"];
    const listItem = document.createElement("li");
    listItem.textContent = plainText;
    if (["askDate", "askString", "askNum"].includes(queryPart.data()["parameter3"])) {
        listItem.textContent = listItem.textContent + userInputArray[userInputIndex++];
    }
    descList.appendChild(listItem);
    disjunctionCounter++;
}
