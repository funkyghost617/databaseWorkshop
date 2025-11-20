import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// manage login and signup window switching
const loginWindow = document.querySelector(".login-window");
const signupWindow = document.querySelector(".signup-window");
const toSignupWindow = document.querySelector("#to-signup-window");
const toLoginWindow = document.querySelector("#to-login-window");
toSignupWindow.addEventListener("click", () => {
    loginWindow.classList.add("hidden");
    signupWindow.classList.remove("hidden");
});
toLoginWindow.addEventListener("click", () => {
    signupWindow.classList.add("hidden");
    loginWindow.classList.remove("hidden");
});

//initialize references to input elements
const loginEmail = document.querySelector("#email");
const loginPassword = document.querySelector("#password");
const signupEmail = document.querySelector("#new-email");
const signupPassword = document.querySelector("#new-password");
const signupPasswordConfirm = document.querySelector("#confirm-new-password");

//signup new user
const signupBtn = document.querySelector("#signup-btn");
signupBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const email = signupEmail.value;
    const password = signupPassword.value;
    createUserWithEmailAndPassword(auth, email, password).then(cred => {
        console.log(cred);
        console.log("success!");
    });
});

//login existing user
const loginBtn = document.querySelector("#login-btn");
loginBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const email = loginEmail.value;
    const password = loginPassword.value;
    
});