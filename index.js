"use strict";
document.addEventListener("DOMContentLoaded", start);

const HTML = {};
const endPoint = "https://dxcleads-df01.restdb.io/rest/leads";
const APIKey = "5ea40f3f1851f96a8ea16741";
let elements;
let vh;

function start() {
    console.log("start");

    HTML.signupForm = document.querySelector(".signup_form");
    HTML.directForm = document.querySelector(".direct_form");


    elements = HTML.signupForm.elements;

    vh = window.innerHeight * 0.01;
    document.querySelector("#hero").style.setProperty('--vh', `${vh}px`);

    window.addEventListener("resize", resizeWindow);

    document.querySelector("#access_btn").addEventListener("click", modifyForm);
    document.querySelector("#back_btn").addEventListener("click", modifyForm);
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
            //Gør så man ikke kan trykke flere gange på submit knappen
            elements.signup.setAttribute("disabled", true);
            //Hvis formularen er valid, checker vi først om brugeren allerede er i systemet.
            fetch(`${endPoint}?q={"email":"${elements.email.value}"}`, {
                    method: "get",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                        "x-apikey": `${APIKey}`,
                        "cache-control": "no-cache"
                    }
                })
                .then(e => e.json())
                .then(e => {
                    //Hvis brugeren ikke er i systemet, sender vi alt dataen til databasen
                    if (e.length === 0) {
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
                        //Hvis brugeren allerede er i systemet, opdaterer vi brugeren med et ekstra assetview
                        const data = {
                            $inc: {
                                assetviews: 1
                            }
                        }

                        const postData = JSON.stringify(data);
                        updateUser(postData, e);
                    }
                });
        } else {
            console.log("Not valid form");
        }
    })

    HTML.directForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const formValidity = HTML.directForm.checkValidity();

        if (formValidity) {
            document.querySelector("#submit_direct").setAttribute("disabled", true);
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
    HTML.signupForm.classList.toggle("hide");
    HTML.directForm.classList.toggle("hide");

    if (!HTML.signupForm.classList.contains("hide")) {
        document.querySelector("#form_container > h2").textContent = "Sign up here, to gain direct access to the white paper";
        document.querySelector("#form_container > p > span").textContent = "Already signed up?";
        document.querySelector("#access_btn").classList.remove("hide");
        document.querySelector("#access_btn").textContent = "Get direct access."
    } else if (!HTML.directForm.classList.contains("hide")) {
        document.querySelector("#form_container > h2").textContent = "We are glad you are back!";
        document.querySelector("#form_container > p > span").textContent = "Please type your work e-mail address, so we can verify your information.";
        document.querySelector("#access_btn").classList.add("hide");
    }
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
        .then(e => {
            //Vi checker om brugeren er i systemet eller ej
            if (e.length === 0) {
                console.log("NOT IN THE SYSTEM");
                //SHOW ERROR
            } else {
                updateUser(postData, e);
            }
        })
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