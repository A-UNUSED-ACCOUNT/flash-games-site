var baseURL = "https://raw.githack.com/tsukisuperior/flash-games/master/",
    /*The Ruffle toggle button*/
    ruffleToggleButton = document.getElementById("ruffleToggle"),
    /*the drop down box of filenames*/
    list = document.getElementById("list"),
    /*A regexp to filter out .git files*/
    allowedFiles = /\.swf/,

    xhttp,

    element,

    dimensions = [0, 0],

    name,

    swf,

    tmp;

function getSize(swf) {
    var mWidth,
        mHeight,
        cByte = swf[currentOffset++],
        NbBits = cByte >> 3,
        currentBit = 2,
        currentOffset = 0x8,
        currentValue;
    cByte &= 7;
    cByte <<= 5;
    for (var numField = 0; numField < 4; numField++) {
        currentValue = 0;
        var bitcount = 0;
        while (bitcount < NbBits) {
            if ((cByte & 128) == 128) {
                currentValue = currentValue + (1 << (NbBits - bitcount - 1));
            }
            cByte <<= 1;
            cByte &= 255;
            currentBit--;
            bitcount++;
            if (currentBit < 0) {
                cByte = swf[currentOffset++];
                currentBit = 7;
            }
        }
        currentValue /= 20;
        switch (numField) {
            case 0:
                mWidth = currentValue;
                break;
            case 1:
                mWidth = currentValue - mWidth;
                break;
            case 2:
                mHeight = currentValue;
                break;
            case 3:
                mHeight = currentValue - mHeight;
                break;
        }
    }
    dimensions[0] = (mWidth > 10) ? 1280 : mWidth;
    dimensions[1] = (mHeight > 10) ? 1024 : mHeight;
}

if (localStorage.getItem("token") != "flash") {
    localStorage.setItem("token", "flash");
    localStorage.setItem("game", "");
    alert("Choose a game from the dropdown box");

} else {
    name = localStorage.getItem("game");
}


xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        var response = JSON.parse(this.responseText);
        for (var x = 0; x < response.length; x++) {
            if (allowedFiles.test(response[x].name)) {
                element = document.createElement("option");
                list.appendChild(element);
                element.innerHTML = (response[x].name).replace(/-|\.swf/g, " ");
            }
        }
    }
};

xhttp.open("GET", "https://api.github.com/repos/tsukisuperior/flash-games/contents", true);
xhttp.send();

xhttp = new XMLHttpRequest();
xhttp.onload = function () {
    if (this.readyState == 4 && this.status == 200) {
        getSize(new Uint8Array(xhttp.response));
        element = document.createElement("embed");
        element.src = (baseURL + name.replace(/ /g, "-"));
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

xhttp.open("GET", baseURL + name.replace(/ /g, "-"), true);
xhttp.responseType = "arraybuffer";
xhttp.send();

list.addEventListener("change", function () {
    localStorage.setItem("game", list.value.replace("/ /g", "-") + ".swf");
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
