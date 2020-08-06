var element = document.createElement("embed");
element.src = localStorage.getItem("game");
element.width = "640px";
element.width = "480px";
document.body.appendChild(element);

if (localStorage.getItem("useRuffle") == "true") {
    element = document.createElement("script");
    element.src = "./ruffle/ruffle.js";
    document.body.appendChild(element);
}