if (localStorage.getItem("useRuffle") == "true") {
    document.head.innerHTML += "<script src=\"./ruffle/ruffle.js\"></script>";
}
var element = document.createElement("embed");
element.src = localStorage.getItem("game");
document.body.appendChild(element);
