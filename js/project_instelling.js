let endpoint = "https://dwapi.dev/item";
let tweede_endpoint = "https://dwapi.dev";
let project = "4nqmlRAiE5cG";
let token = "";

let gebruiker = JSON.parse(window.sessionStorage.getItem("user"));
(gebruiker !== null) ? token = gebruiker[0].token : '';

let boodschap = {
    9008: "Actieve gebruiker met dit e-mailadres/wachtwoord niet gevonden.",
    9009: "yyy"
}

console.log(boodschap[9008]);