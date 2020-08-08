var baseURL = "https://raw.githack.com/tsukisuperior/flash-games/master/",
    /*The Ruffle toggle button*/
    ruffleToggleButton = document.getElementById("ruffleToggle"),
    /*the drop down box of filenames*/
    list = document.getElementById("list"),
    /*A regexp to filter out .git files*/
    allowedFiles = /\.swf/,
    /*A object containing all the swf files info, generated from info.json*/
    swfInfo = {},

    xhttp,

    element,

    dimensions = [1280, 1024],

    name = ((localStorage.getItem("game").replace(/-/g, " ")).replace(/\.swf/g, " ")).replace(/ /g, "-") + ".swf",

    tmp;

xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        var response = JSON.parse(this.responseText);
        for (var x = 0; x < response.length; x++) {
            if (allowedFiles.test(response[x].name)) {
                element = document.createElement("option");
                list.appendChild(element);
                element.innerHTML = ((response[x].name).replace(/-/g, " ")).replace(/\.swf/g, " ");
            }
        }
    }
};
xhttp.open("GET", "https://api.github.com/repos/tsukisuperior/flash-games/contents", true);
xhttp.send();

xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        swfInfo = JSON.parse(this.responseText);
        if (typeof swfInfo[name] != "undefined" && typeof swfInfo[name]["Dimensions"] == "string" && swfInfo[name]["Dimensions"].toLowerCase() != "unknown" && swfInfo[name]["Dimensions"].toLowerCase() != "") {
            dimensions = swfInfo[name]["Dimensions"].toLowerCase().split("x");
        }
        element = document.createElement("embed");
        element.src = (baseURL + name);
        element.width = dimensions[0] + "px";
        element.height = dimensions[1] + "px";
        element.id = "game";
        element.style.transform = "scale(" + Math.min((window.innerWidth / dimensions[0]), (window.innerHeight / dimensions[1])) + ")";
        element.style.top = (((((window.innerWidth / dimensions[0]) + (window.innerHeight / dimensions[1])) / 2) * dimensions[1]) / 2) + "px";
        element.style.position = "relative";

        document.getElementById("gameContainer").appendChild(element);
        if (localStorage.getItem("useRuffle") == "true") {
            element = document.createElement("script");
            element.src = "./ruffle/ruffle.js";
            document.body.appendChild(element);
        }
    }
};
xhttp.open("GET", baseURL + "info.json", true);
xhttp.send();



list.addEventListener("change", function () {
    localStorage.setItem("game", list.value);
    location.reload();
});
ruffleToggleButton.addEventListener("click", function () {
    localStorage.setItem("useRuffle", localStorage.getItem("useRuffle") != "true");
    location.reload();
});
window.addEventListener("resize", function () {
    document.getElementById("game").style.transform = "scale(" + Math.min((window.innerWidth / dimensions[0]), (window.innerHeight / dimensions[1])) + ")";
    document.getElementById("game").style.top = (((((window.innerWidth / dimensions[0]) + (window.innerHeight / dimensions[1])) / 2) * dimensions[1]) / 2) + "px";
});

