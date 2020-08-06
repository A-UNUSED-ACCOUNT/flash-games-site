if (localStorage.getItem("useRuffle") == "true"){
    var element= document.createElement("script");
    element.src="./ruffle/ruffle.js";
    document.body.appendChild(element);
}