"use strict";
document.addEventListener("DOMContentLoaded", start);

function start() {
    console.log("start");

    if (localStorage.getItem("auth")) {
        console.log("authenticated");
    } else {
        console.log("not authenticated");
    }
}