/*The base url for the repo*/
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
    swfInfo = {};

/*
requests the list of files from the server and puts it in files
*/
function getFileListing(target) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            for (var x = 0; x < response.length; x++) {
                files.push(response[x].name);
            }
            refreshGames();
        }
    };
    xhttp.open("GET", target, true);
    xhttp.send();
}

/*
generates drop down box
*/
function refreshGames() {
    var element;
    for (var x = 0; x < files.length; x++) {
        if (!allowedFiles.test(files[x])) {
            continue;
        }
        element = document.createElement("option");
        list.appendChild(element);
        element.innerHTML = files[x];
    }

}

/*
saves game name in localstorage, and reloads the page
*/
function saveGameName() {
    localStorage.setItem("game", list.value)
    location.reload();
}

/*toggles ruffle, and reloads*/
function toggleRuffle() {
    localStorage.setItem("useRuffle", localStorage.getItem("useRuffle") != "true");
    location.reload();
}

/*
gets info.json, a file that contains a lot of info on the swf files
*/
function getInfofile() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            swfInfo = JSON.parse(this.responseText);
            startSwf();
        }
    };
    xhttp.open("GET", "https://test.spontaneousegg.com/info.json", true);
    xhttp.send();
}

/*
generates the embed element for the swf file in localstorage
the resolution of the swf is kept in info.json
if a valid entry for a swf file is not found, the default resolution is 1280x1024
*/
function startSwf() {
    var dimensions,
        name = localStorage.getItem("game");
    if (typeof swfInfo[name] != "undefined" && typeof swfInfo[name]["Dimensions"] == "string" && swfInfo[name]["Dimensions"].toLowerCase() != "unknown" && swfInfo[name]["Dimensions"].toLowerCase() != "") {
        console.log(swfInfo[name]);
        dimensions = swfInfo[name]["Dimensions"].toLowerCase().split("x");
    } else {
        dimensions = [1280, 1024];
    }
    var element = document.createElement("embed");
    element.src = baseURL + localStorage.getItem("game");
    element.width = dimensions[0] + "px";
    element.height = dimensions[1] + "px";
    document.body.appendChild(element);
    if (localStorage.getItem("useRuffle") == "true") {
        element = document.createElement("script");
        element.src = "./ruffle/ruffle.js";
        document.body.appendChild(element);
    }
}

/*
initializing functions
*/
list.addEventListener("change", saveGameName);
ruffleToggleButton.addEventListener("click", toggleRuffle);
getFileListing("https://api.github.com/repos/tsukisuperior/flash-games/contents");            //get the listing
getInfofile();
