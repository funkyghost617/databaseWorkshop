let loadScreen = document.createElement("div");
loadScreen.classList.add("loadScreen");

let loadCircle = document.createElement("div");
let loadingMessage = document.createElement("p");
loadingMessage.textContent = "loading....";

loadScreen.appendChild(loadCircle);
loadScreen.appendChild(loadingMessage);
let body = document.querySelector("body");
body.appendChild(loadScreen);