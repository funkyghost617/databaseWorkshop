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