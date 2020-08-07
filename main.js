
var baseURL = "https://raw.githack.com/tsukisuperior/flash-games/master/",           //The base url for the repo
    ruffleToggleButton = document.getElementById("ruffleToggle"),                    //The message element at the top of the page
    files = [],                                                                      //the list of file names
    list = document.getElementById("list"),                                          //file listing dropdown box
    exceptedFiles = /\.git*/,                                                         //Regular Expression to find .gitingore and the such
    swfInfo = {};


function getFileListing(target) {                                                    //gets file listing from github repo
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

function refreshGames() {                                                                    //Fills in the dropdown box of games
    var element;
    for (var x = 0; x < files.length; x++) {
        if (exceptedFiles.test(files[x])) {                                                  //ignores the .git* files
            continue;
        }
        element = document.createElement("option");
        list.appendChild(element);
        element.innerHTML = files[x];
    }

}

function getURL() {                                                                            //save the url of the selected swf and reload
    localStorage.setItem("game", baseURL + list.value)
    location.reload();
}

function toggleRuffle() {                                                                       // save the state of ruffles activation and reload
    localStorage.setItem("useRuffle", localStorage.getItem("useRuffle") != "true");
    location.reload();
}

function getInfofile() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            swfInfo = JSON.parse(this.responseText);
            startSwf();
        } else {
            console.log("Could not get info.json");
        }
    };
    xhttp.open("GET", location.href + "/info.json", true);
    xhttp.send();
}

function startSwf() {
    var dimensions;
    if (typeof swfInfo[name] != "undefined" && typeof swfInfo[name]["Dimensions"] == "string" && swfInfo[name]["Dimensions"].toLowerCase() != "unknown" && swfInfo[name]["Dimensions"].toLowerCase() != "") {
        console.log(swfInfo[name]);
        dimensions = swfInfo[name]["Dimensions"].toLowerCase().split("x");
    } else {
        dimensions = [1280, 1024];
    }
    var element = document.createElement("embed");
    element.src = localStorage.getItem("game");
    element.width = dimensions[0] + "px";
    element.height = dimensions[1] + "px";
    console.log("Width " + dimensions[0]);
    console.log("Height  " + dimensions[1]);
    document.body.appendChild(element);
    if (localStorage.getItem("useRuffle") == "true") {
        element = document.createElement("script");
        element.src = "./ruffle/ruffle.js";
        document.body.appendChild(element);
    }
}

list.addEventListener("change", getURL);
ruffleToggleButton.addEventListener("click", toggleRuffle);
getFileListing("https://api.github.com/repos/tsukisuperior/flash-games/contents");            //get the listing
getInfofile();
