"use strict";
document.addEventListener("DOMContentLoaded", start);

const HTML = {};
const endPoint = "https://dxcleads-df01.restdb.io/rest/leads";
const APIKey = "5ea40f3f1851f96a8ea16741";
let elements;
let vh;

function start() {
    console.log("start");

    HTML.signupForm = document.querySelector("#signup_form");
    HTML.directForm = document.querySelector("#direct_form");


    elements = HTML.signupForm.elements;

    vh = window.innerHeight * 0.01;
    document.querySelector("#hero").style.setProperty('--vh', `${vh}px`);

    window.addEventListener("resize", resizeWindow);

    document.querySelector("#access_btn").addEventListener("click", modifyForm);
    formReady();
}

function resizeWindow() {
    vh = window.innerHeight * 0.01;
    document.querySelector("#hero").style.setProperty('--vh', `${vh}px`);
}

function formReady() {
    HTML.signupForm.setAttribute("novalidate", true);
    HTML.directForm.setAttribute("novalidate", true);

    HTML.signupForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const formValidity = HTML.signupForm.checkValidity();

        if (formValidity) {
            const data = {
                firstname: elements.firstname.value,
                lastname: elements.lastname.value,
                email: elements.email.value,
                company: elements.company.value,
                jobtitle: elements.jobtitle.value,
                country: elements.country.value,
                assetviews: 1
            };

            // clearForm();
            post(data);
        } else {
            console.log("Not valid form");
        }
    })

    HTML.directForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const formValidity = HTML.directForm.checkValidity();

        if (formValidity) {
            const data = {
                $inc: {
                    assetviews: 1
                }
            }

            let user = document.querySelector("#direct_email").value;
            // clearForm();
            getUser(data, user);
        } else {
            console.log("Not valid form");
        }
    })
}

function modifyForm() {
    console.log("modify");
    HTML.signupForm.style.display = "none";
    HTML.directForm.style.display = "block";
}

//POST
function post(data) {
    const postData = JSON.stringify(data);

    fetch(endPoint + "?max=100", {
            method: "post",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "x-apikey": `${APIKey}`,
                "cache-control": "no-cache"
            },
            body: postData
        })
        .then(e => e.json())
        .then(e => console.log(e));
}

//PUT
function getUser(data, user) {
    const postData = JSON.stringify(data);

    fetch(`${endPoint}?q={"email":"${user}"}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "x-apikey": `${APIKey}`,
                "cache-control": "no-cache"
            }
        })
        .then(e => e.json())
        .then(e => updateUser(postData, e));
}

function updateUser(postData, e) {
    let userID = e[0]._id;

    fetch(`${endPoint}/${userID}`, {
            method: "put",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "x-apikey": `${APIKey}`,
                "cache-control": "no-cache"
            },
            body: postData
        })
        .then(e => e.json())
        .then(e => console.log(e))
}