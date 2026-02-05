import { getAuth, signOut, onAuthStateChanged, updateProfile, sendEmailVerification } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { app, db } from "./firebaseScript.js";

const auth = getAuth(app);

const verifyEmailMsg = document.querySelector("#verify-email-message");

let userID;
auth.onAuthStateChanged(user => {
    userID = user.uid;
    populatePage(user);
    if (!user.emailVerified) {
        verifyEmailMsg.innerHTML = `Because your email is not yet verified, you won't be able to access any other pages. To send a verification link to your email, <span id="verify-email-link">click here.</span>`;
        const emailLink = document.querySelector("#verify-email-link");
        emailLink.addEventListener("click", async (e) => {
            e.preventDefault();
            sendEmailVerification(user).then(() => {
                const verifySuccess = document.createElement("p");
                verifySuccess.textContent = "email sent!";
                verifyEmailMsg.insertAdjacentElement("afterend", verifySuccess);
            })
        })
    } else {
        verifyEmailMsg.remove();
    }
})



const usernameContainer = document.querySelector("#username");
const fullNameContainer = document.querySelector("#full-name");
const emailContainer = document.querySelector("#email");
const emailVerificationCont = document.querySelector("#email-verified");

async function populatePage(user) {
    usernameContainer.textContent = user.displayName;
    const userDoc = await getDoc(doc(db, "users", userID));
    fullNameContainer.textContent = userDoc.data()["full_name"];
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