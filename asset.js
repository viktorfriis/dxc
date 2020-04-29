"use strict";
document.addEventListener("DOMContentLoaded", start);

const HTML = {};
const endPoint = "https://dxcleads-df01.restdb.io/rest/leads";
const APIKey = "5ea40f3f1851f96a8ea16741";
let elements;

function start() {
    console.log("start");

    if (localStorage.getItem("auth")) {
        console.log("authenticated");
    } else {
        console.log("not authenticated");
        showForm();
    }
}

function showForm() {
    document.querySelector("#signup_asset").classList.remove("hide");
    document.querySelector("header").classList.add("hide");
    document.querySelector("main").classList.add("hide");
    document.querySelector("footer").classList.add("hide");

    HTML.signupForm = document.querySelector(".signup_form");
    HTML.directForm = document.querySelector(".direct_form");
    elements = HTML.signupForm.elements;

    document.querySelector("#access_btn").addEventListener("click", modifyForm);
    document.querySelector("#back_btn").addEventListener("click", modifyForm);

    formReady();
}


function formReady() {
    HTML.signupForm.setAttribute("novalidate", true);
    HTML.directForm.setAttribute("novalidate", true);

    if (elements.country.value === "") {
        elements.country.style.color = "gray";
        elements.country.addEventListener("change", () => {
            if (elements.country.value != "") {
                elements.country.style.color = "black";
            } else {
                elements.country.style.color = "gray";
            }
        })
    }

    HTML.signupForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const formValidity = HTML.signupForm.checkValidity();

        if (formValidity) {
            //Gør så man ikke kan trykke flere gange på submit knappen
            elements.signup.setAttribute("disabled", true);
            document.querySelector("#submit_loader").classList.remove("asset_hide");
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

            if (!elements.firstname.checkValidity()) {
                elements.firstname.classList.add("invalid");
                document.querySelector(".first-err").classList.remove("hide");

                elements.firstname.addEventListener("focus", () => {
                    elements.firstname.classList.remove("invalid");
                    document.querySelector(".first-err").classList.add("hide");
                })
            }
            if (!elements.lastname.checkValidity()) {
                elements.lastname.classList.add("invalid");
                document.querySelector(".last-err").classList.remove("hide");

                elements.lastname.addEventListener("focus", () => {
                    elements.lastname.classList.remove("invalid");
                    document.querySelector(".last-err").classList.add("hide");
                })
            }
            if (!testEmail(elements.email.value)) {
                elements.email.classList.add("invalid");
                document.querySelector(".email-err").classList.remove("hide");

                elements.email.addEventListener("focus", () => {
                    elements.email.classList.remove("invalid");
                    document.querySelector(".email-err").classList.add("hide");
                })
            }
            if (!elements.company.checkValidity()) {
                elements.company.classList.add("invalid");
                document.querySelector(".company-err").classList.remove("hide");

                elements.company.addEventListener("focus", () => {
                    elements.company.classList.remove("invalid");
                    document.querySelector(".company-err").classList.add("hide");
                })
            }
            if (!elements.jobtitle.checkValidity()) {
                elements.jobtitle.classList.add("invalid");
                document.querySelector(".title-err").classList.remove("hide");

                elements.jobtitle.addEventListener("focus", () => {
                    elements.jobtitle.classList.remove("invalid");
                    document.querySelector(".title-err").classList.add("hide");
                })
            }
            if (!elements.country.checkValidity()) {
                elements.country.classList.add("invalid");
                document.querySelector(".country-err").classList.remove("hide");

                elements.country.addEventListener("focus", () => {
                    elements.country.classList.remove("invalid");
                    document.querySelector(".country-err").classList.add("hide");
                })
            }
            if (!elements.consent.checkValidity()) {
                document.querySelector("#consent_label").style.color = "red";


                elements.consent.addEventListener("focus", () => {
                    document.querySelector("#consent_label").style.color = "black";
                })
            }
        }
    })

    HTML.directForm.addEventListener("submit", (e) => {
        e.preventDefault();

        if (testEmail(document.querySelector("#direct_email").value)) {
            document.querySelector("#submit_direct").setAttribute("disabled", true);
            document.querySelector("#direct_loader").classList.remove("asset_hide");
            const data = {
                $inc: {
                    assetviews: 1
                }
            }

            let user = document.querySelector("#direct_email").value;
            getUser(data, user);
        } else {
            console.log("Not valid form");
            //SHOW ERROR
            document.querySelector("#direct_email").classList.add("invalid");
            document.querySelector(".direct-err").classList.remove("hide");

            document.querySelector("#direct_email").addEventListener("focus", () => {
                document.querySelector("#submit_direct").removeAttribute("disabled", true);
                document.querySelector("#direct_email").classList.remove("invalid");
                document.querySelector(".direct-err").classList.add("hide");
            })
        }
    })
}

function testEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function modifyForm() {
    console.log("modify");
    HTML.signupForm.classList.toggle("hide");
    HTML.directForm.classList.toggle("hide");

    if (!HTML.signupForm.classList.contains("hide")) {
        document.querySelector("#form_container > h2").textContent = "Gain access to the white paper.";
        document.querySelector("#form_container > p").textContent = "Please tell us a bit about yourself and your company, to gain access to the white paper.";
        document.querySelector("#form_container > p > span").textContent = "Already signed up?";
        document.querySelector("#access_btn").classList.remove("hide");
        document.querySelector("#access_btn").textContent = "Get direct access."
    } else if (!HTML.directForm.classList.contains("hide")) {
        document.querySelector("#form_container > h2").textContent = "We are glad you are back!";
        document.querySelector("#form_container > p > span").textContent = "Please type your work e-mail address, so we can verify your information.";
        document.querySelector("#form_container > p").textContent = "";
        document.querySelector("#access_btn").classList.add("hide");
    }
}

//POST
function post(data) {
    //SET LOCAL STORAGE
    localStorage.setItem("auth", true);
    localStorage.setItem("userEmail", data.email);
    localStorage.setItem("firstName", data.firstname);

    //POSTING DATA TO DATABASE
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
        .then(e => window.location.href = "assets.html");
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
                document.querySelector("#direct_loader").classList.add("asset_hide");
                //SHOW ERROR
                document.querySelector("#direct_email").classList.add("invalid");
                document.querySelector(".direct-err").classList.remove("hide");

                document.querySelector("#direct_email").addEventListener("focus", () => {
                    document.querySelector("#submit_direct").removeAttribute("disabled", true);
                    document.querySelector("#direct_email").classList.remove("invalid");
                    document.querySelector(".direct-err").classList.add("hide");
                })
            } else {
                updateUser(postData, e);
            }
        })
}

function updateUser(postData, e) {
    //SET LOCAL STORAGE
    localStorage.setItem("auth", true);
    localStorage.setItem("userEmail", e[0].email);
    localStorage.setItem("firstName", e[0].firstname);

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
        .then(e => window.location.href = "assets.html")
}