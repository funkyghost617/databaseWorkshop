import { getAuth, signOut, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { app } from "./firebaseScript.js";

const auth = getAuth(app);

auth.onAuthStateChanged(userRes => {
    let user = auth.currentUser;
    populatePage(user);
})

const nameContainer = document.querySelector("#name");
const emailContainer = document.querySelector("#email");
const emailVerificationCont = document.querySelector("#email-verified");

function populatePage(user) {
    nameContainer.textContent = user.displayName;
    emailContainer.textContent = user.email;
    emailVerificationCont.textContent = user.emailVerified;
    nameInput.value = "";
}

const nameInput = document.querySelector("#name-textbox");
const nameSubmit = document.querySelector("#submit-name");

nameSubmit.addEventListener("click", (e) => {
    e.preventDefault();
    if (nameInput.value != "") {
        updateProfile(auth.currentUser, { displayName: nameInput.value });
    }
})