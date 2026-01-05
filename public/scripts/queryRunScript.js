//initialize firestore connections
import { collection, doc, getDoc, getDocs, addDoc, query, orderBy, where, limit } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { db } from "./firebaseScript.js";

const tableBody = document.querySelector("tbody");

const savedQueriesSnap = await getDocs(collection(db, "queries", "compound_queries", "saved_queries"));
savedQueriesSnap.forEach(async (item) => {
    const queryRow = document.createElement("tr");
    queryRow.setAttribute("data-id", item.id);
    const queryName = document.createElement("td");
    queryName.textContent = item.data()["query-name"];
    const queryCreateDate = document.createElement("td");
    queryCreateDate.textContent = item.data()["date-created"];
    const queryCreator = document.createElement("td");
    const creatorID = item.data()["created-by"];
    const creatorSnap = await getDoc(doc(db, "users", creatorID));
    queryCreator.textContent = creatorSnap.data()["full_name"];
    queryRow.append(queryName, queryCreateDate, queryCreator);
    tableBody.appendChild(queryRow);
    queryRow.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = `./run/${queryRow.getAttribute("data-id")}`;
    });
});