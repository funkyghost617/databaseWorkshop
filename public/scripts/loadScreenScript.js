let loadScreen = document.createElement("div");
loadScreen.classList.add("loadScreen");
loadScreen.style.setProperty("display", "flex");
loadScreen.style.setProperty("justify-content", "center");
loadScreen.style.setProperty("align-items", "center");
loadScreen.style.setProperty("position", "absolute");
loadScreen.style.setProperty("width", "100%");
loadScreen.style.setProperty("height", "100%");
loadScreen.style.setProperty("background-color", "white");

let loadCircle = document.createElement("div");
loadCircle.style.setProperty("width", "200px");
loadCircle.style.setProperty("height", "200px");
loadCircle.style.setProperty("background-color", "darkgreen");

let loadingMessage = document.createElement("p");
loadingMessage.textContent = "loading....";

loadCircle.appendChild(loadingMessage);
loadScreen.appendChild(loadCircle);
let body = document.querySelector("body");
body.appendChild(loadScreen);