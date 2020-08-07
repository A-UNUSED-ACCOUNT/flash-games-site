var baseURL = "https://raw.githack.com/tsukisuperior/flash-games/master/",
    /*The Ruffle toggle button*/
    ruffleToggleButton = document.getElementById("ruffleToggle"),
    /*A array of the flash object filenames*/
    files = [],
    /*the drop down box of filenames*/
    list = document.getElementById("list"),
    /*A regexp to filter out .git files*/
    allowedFiles = /\.swf/,
    /*A object containing all the swf files info, generated from info.json*/
    swfInfo = {},

    xhttp,

    element,

    dimensions = [1280, 1024],

    name = localStorage.getItem("game")

xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        var response = JSON.parse(this.responseText);
        for (var x = 0; x < response.length; x++) {
            if (allowedFiles.test(files[x])) {
                element = document.createElement("option");
                list.appendChild(element);
                element.innerHTML = files[x];
            }
        }
        refreshGames();
    }
};
xhttp.open("GET", "https://api.github.com/repos/tsukisuperior/flash-games/contents", true);
xhttp.send();

xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        swfInfo = JSON.parse(this.responseText);
        startSwf();
    }
};
xhttp.open("GET", "https://test.spontaneousegg.com/info.json", true);
xhttp.send();

if (typeof swfInfo[name] != "undefined" && typeof swfInfo[name]["Dimensions"] == "string" && swfInfo[name]["Dimensions"].toLowerCase() != "unknown" && swfInfo[name]["Dimensions"].toLowerCase() != "") {
    dimensions = swfInfo[name]["Dimensions"].toLowerCase().split("x");
}
element = document.createElement("embed");
element.src = baseURL + localStorage.getItem("game");
element.width = dimensions[0] + "px";
element.height = dimensions[1] + "px";
document.body.appendChild(element);
if (localStorage.getItem("useRuffle") == "true") {
    element = document.createElement("script");
    element.src = "./ruffle/ruffle.js";
    document.body.appendChild(element);
}

list.addEventListener("change", function () {
    localStorage.setItem("game", list.value)
    location.reload();
});
ruffleToggleButton.addEventListener("click", function () {
    localStorage.setItem("useRuffle", localStorage.getItem("useRuffle") != "true");
    location.reload();
});