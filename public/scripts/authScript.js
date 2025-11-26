import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { auth } from "./firebaseScript.js";

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

// create references to input elements and error messages
const loginEmail = document.querySelector("#email");
const loginPassword = document.querySelector("#password");
const signupEmail = document.querySelector("#new-email");
const signupPassword = document.querySelector("#new-password");
const signupPasswordConfirm = document.querySelector("#confirm-new-password");
const loginError = document.querySelector("#login-error");
const signupError = document.querySelector("#signup-error");

/* signup new user
    -- the signUp function first checks that the email is valid and passwords match
    -- if the user's submissions are invalid, the appropriate error message is displayed onscreen
    -- if the user's submissions are valid, they are signed up and automatically logged in with the new account
    -- event listeners are created which run the signUp() function when the signup button is clicked or 
        the enter key is pressed when any of the input fields are focused
*/
const signupBtn = document.querySelector("#signup-btn");
function signUp() {
    const email = signupEmail.value;
    const password = signupPassword.value;
    const passwordConfirm = signupPasswordConfirm.value;
    if (!validateEmail(email)) {
        signupError.textContent = "Please enter a valid email";
    } else if (password == "") {
        signupError.textContent = "Please enter a password";
    } else if (password != passwordConfirm) {
        signupError.textContent = "Passwords much match";
    } else {
        signupError.textContent = "";
        createUserWithEmailAndPassword(auth, email, password).then(console.log("successfully signed up!"));
    };
};
signupBtn.addEventListener("click", (e) => {
    e.preventDefault();
    signUp();
});
const signupInputs = [signupEmail, signupPassword, signupPasswordConfirm];
signupInputs.forEach((input) => {
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            signUp();
        };
    });
});

/* login existing user
    -- the logIn function first checks that the email is valid
    -- if the user's submissions are invalid, the appropriate error message is displayed onscreen
    -- if the user's submissions are valid, they are logged in
    -- event listeners are created which run the logIn() function when the signup button is clicked or 
        the enter key is pressed when any of the input fields are focused
*/
const loginBtn = document.querySelector("#login-btn");
function logIn() {
    const email = loginEmail.value;
    const password = loginPassword.value;
    if (!validateEmail(email)) {
        loginError.textContent = "Please enter a valid email";
    } else if (password == "") {
        loginError.textContent = "Please enter a password";
    } else {
        loginError.textContent = "";
        signInWithEmailAndPassword(auth, email, password).then(console.log("successfully logged in!"));
    };
};
loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    logIn();
});
const loginInputs = [loginEmail, loginPassword];
loginInputs.forEach((input) => {
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            logIn();
        };
    });
});

// login as guest (registers as anonymous user on firebase server)
const guestBtn = document.querySelector("#login-as-guest");
guestBtn.addEventListener("click", (e) => {
    e.preventDefault();
    signInAnonymously(auth).then(console.log("successfully logged in as guest!"));
});

/* detect authentication changes
    -- the resetOrRedirect function checks if there is a valid user currently logged in
        -- if there is not a valid user currently logged in, the inputs on the page are reset
        -- if there is a valid user currently logged in, they are redirected to the homepage
    -- resetOrRedirect is automatically run when the page is first loaded
    -- resetOrRedirect is also run when there is a change in the user's authentication state
*/
function resetOrRedirect(user) {
    if (!user) {
        loginEmail.value = "";
        loginPassword.value = "";
        signupEmail.value = "";
        signupPassword.value = "";
        signupPasswordConfirm.value = "";
    } else {
        window.location.href = "./pages/home.html";
    }
};
resetOrRedirect(auth.currentUser);
onAuthStateChanged(auth, (user) => {
    resetOrRedirect(user);
});

// validate email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validateEmail(email) {
    return emailRegex.test(email);
}