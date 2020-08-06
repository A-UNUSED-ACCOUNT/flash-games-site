if (localStorage.getItem("useRuffle") == "true") {
    var element = document.createElement("embed");
    element.src = localStorage.getItem("game");
    document.body.appendChild(element);
    element = document.createElement("script");
    element.src = "./ruffle/ruffle.js";
    document.body.appendChild(element);
}