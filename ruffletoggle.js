var element = document.createElement("embed");
element.src = localStorage.getItem("game");
document.body.appendChild(element);

if (localStorage.getItem("useRuffle") == "true") {
    element = document.createElement("script");
    element.src = "./ruffle/ruffle.js";
    document.body.appendChild(element);
}