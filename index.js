"use strict";
document.addEventListener("DOMContentLoaded", start);

const HTML = {};
const endPoint = "https://dxcleads-df01.restdb.io/rest/leads";
const APIKey = "5ea3f5d51851f96a8ea16732";
let elements;
let vh;

function start() {
    console.log("start");

    vh = window.innerHeight * 0.01;
    document.querySelector("#hero").style.setProperty('--vh', `${vh}px`);

    window.addEventListener("resize", resizeWindow);
}

function resizeWindow() {
    vh = window.innerHeight * 0.01;
    document.querySelector("#hero").style.setProperty('--vh', `${vh}px`);
}