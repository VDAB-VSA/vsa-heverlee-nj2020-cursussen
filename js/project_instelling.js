let endpoint = "https://dwapi.dev/item";
let tweede_endpoint = "https://dwapi.dev";
let project = "4nqmlRAiE5cG";
let token = "";

let gebruiker = JSON.parse(window.sessionStorage.getItem("user"));
(gebruiker !== null) ? token = gebruiker[0].token : '';
