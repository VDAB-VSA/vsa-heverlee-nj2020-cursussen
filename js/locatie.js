const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo2LCJleHAiOjE2MjQ5ODg2MjQsImlzcyI6IjRucW1sUkFpRTVjRyIsImlhdCI6MTYyNDk1MjYyNH0.LfLNZxFzMbipADXygMXoNMQo5yiXlLtuxekPTsFiY7Q";
const endpoint = "https://dwapi.dev/item";
const project = "4nqmlRAiE5cG";

let huidige_locatie_actie;
let huidige_locatie_id;
let huidige_filter_waardes = [];
let huidige_sorteer_waarde = ["locatie_id", "ASC"];

window.onload = function(){
    toonLocatiesTabel();
    toonSorteerRichting();
    eventListenersVoorStatischeElementen();
}

function toonLocatiesTabel() {
    let parameters = {
        "endpoint": endpoint, 
        "project": project,
        "token": token, 
        "entity": "locatie",
        "filter": huidige_filter_waardes,
        "sort": huidige_sorteer_waarde
     }
    
    dwapiRead(parameters).then(
        data => {
            let tabel_locaties_html =  "<table>";

            data.result.items.forEach(function(locatie) {
                tabel_locaties_html += "<tr>"+
                    "<td>" + locatie.locatie_id + "</td>" +
                    "<td>" + locatie.naam_campus + "</td>" +
                    "<td>" + locatie.adres + "</td>" + 
                    "<td>" + locatie.postcode + "</td>" +                   
                    "<td>" + locatie.stad + "</td>" +     
                    "<td>"+
                    "<button "+
                    "data-locatie-id='" + locatie.locatie_id + "' "+ 
                    "data-locatie-actie='update' " +
                    "class='button-toon-locatie-modal btn btn-outline-primary' "+
                    "data-mdb-ripple-color='dark'" +
                    "data-mdb-toggle='modal' " +
                    "data-mdb-target='#modal_locatie'>" +
                    "<i class='fa fa-pen'></i>" +
                    "</button>" +
                    "<button " +
                    "data-locatie-id='" + locatie.locatie_id + "' " +
                    "data-locatie-naam='" + locatie.naam_campus + "' " +
                    "class='button-toon-locatie-verwijderen-modal btn btn-outline-danger'" +
                    "data-mdb-ripple-color='dark'" +
                    "data-mdb-toggle='modal' " +
                    "data-mdb-target='#modal_locatie_verwijderen'>" + 
                    "<i class='fa fa-trash'></i>" +
                     "</button>" + "</td>" + "</tr>";
                });
           // tabel_categoriesen_html += "</table>";
            document.getElementById("tabel_locaties").innerHTML = tabel_locaties_html;
            eventListenersVoorDynamischeElementen();            
       }
    )
}

function locatieBewaren() {
    // INVOER
   let locatie_naam = document.getElementById("input_locatie_naam").value;
   let locatie_adres = document.getElementById("input_locatie_adres").value;
   let locatie_postcode = document.getElementById("input_locatie_postcode").value;
   let locatie_stad = document.getElementById("input_locatie_stad").value;

  
    // VERWERJING
    let form_locatie = document.getElementById("form_locatie");
    if (form_locatie.checkValidity()) {
        let locatie = {
            "naam_campus": locatie_naam, 
            "adres": locatie_adres,
            "postcode": locatie_postcode,
            "stad": locatie_stad            
        };

        let parameters = {
            "endpoint": endpoint, 
            "project": project,
            "token": token, 
            "entity": "locatie",
            "values": locatie};
        
        if (huidige_locatie_actie == "update") {
            parameters.filter = ["locatie_id", "=", huidige_locatie_id];
            dwapiUpdate(parameters).then(
                resultaat => {
                    // UITVOER
                    verwerkResultaatNaLocatieActie(resultaat, "modal_locatie");                    
                }
            )
        }
        else {
            dwapiCreate(parameters).then(
                resultaat => {
                    // UITVOER
                    verwerkResultaatNaLocatieActie(resultaat, "modal_locatie");
                }
            )
        }
    }
    else {
        // UITVOER
        form_locatie.classList.add('was-validated');
    }
}

function locatieVerwijderen(locatie_id) {
    // INVOER
    let parameters = {
        "endpoint": endpoint, 
        "project": project,
        "token": token, 
        "entity": "locatie",
        "filter": ["locatie_id", "=", locatie_id]
    }

    // VERWERKING
    dwapiDelete(parameters).then(
        resultaat => {
            verwerkResultaatNaLocatieActie(resultaat, "modal_locatie_verwijderen");
        }
    )
}

function locatiesFilteren() {
    // INVOER
    huidige_filter_waardes = [];
    let filter_naam = document.getElementById("input_filter_locatie").value;
    
    // VERWERKING
    if (String(filter_naam) != "") {
        huidige_filter_waardes.push(["naam_campus", "LIKE", "%" + filter_naam + "%"]);
    }

    // UITVOER
    toonLocatiesTabel();
}

function locatiesSorteren(link) {
    // INVOER
    let sorteer_op = link.dataset.sorteerOp;

    // VERWERKING    
    let sorteer_richting = "ASC";
    if (huidige_sorteer_waarde[0] == sorteer_op && huidige_sorteer_waarde[1] == "ASC") {
        sorteer_richting = "DESC";
    }
    
    huidige_sorteer_waarde = [sorteer_op, sorteer_richting];
    
    // UITVOER
    toonLocatiesTabel();
    toonSorteerRichting();
}

// ------------------ //

function eventListenersVoorStatischeElementen() {

    document.getElementById("button_locatie_bewaren").addEventListener('click', function() {
        locatieBewaren();
    })

    document.getElementById("button_locatie_verwijderen").addEventListener('click', function() {
        locatieVerwijderen(huidige_locatie_id);
    })

    document.getElementById("button_locatie_zoek").addEventListener('click', function() {
        locatiesFilteren();
    })

    let sorteer_links;
    sorteer_links = document.querySelectorAll('.link-locaties-sorteren');
    for (var i = 0; i < sorteer_links.length; i++) {
        sorteer_links[i].addEventListener('click', function() {     
            locatiesSorteren(this);
        })
    }
}

function eventListenersVoorDynamischeElementen() {
    /* "locatie toevoegen" knop (statisch) en "locatie wijzigen" knoppen (dynamisch) */
    let toon_locatie_modal_buttons;
    toon_locatie_modal_buttons = document.querySelectorAll('.button-toon-locatie-modal');
    if (toon_locatie_modal_buttons) {
        for (var i = 0; i < toon_locatie_modal_buttons.length; i++) {
            toon_locatie_modal_buttons[i].addEventListener('click', function() {            
                toonlocatieModal(this);
            });            
        }        
    }

    /* "locatie verwijderen" knoppen */
    buttons = document.querySelectorAll('.button-toon-locatie-verwijderen-modal');
    if (buttons) {
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', function() {               
                toonlocatieVerwijderenModal(this);
            });            
        }           
    }
}


function toonlocatieModal(via_button) {

    // INVOER
    huidige_locatie_actie = via_button.dataset.locatieActie;
    huidige_locatie_id = via_button.dataset.locatieId;

    // UITVOER
     resetlocatieFormulier();  
    if (huidige_locatie_actie == "update") {
        document.getElementById("modal_locatie_titel").innerHTML = "Locatie wijzigen";
        toonHuidiglocatieInFormulier();
    }
    else {
        document.getElementById("modal_locatie_titel").innerHTML = "Nieuw locatie toevoegen";
    }

    // verwijder vorige validatie
    document.getElementById("form_locatie").classList.remove('was-validated');
}

function toonlocatieVerwijderenModal(via_button) {
    // VERWERKING
    huidige_locatie_id = via_button.dataset.locatieId;
    
    // UITVOER
    document.getElementById("label_locatie_verwijderen").innerHTML = "Wil u locatie <strong>" + via_button.dataset.locatieNaam + "</strong> echt verwijderen?";
}


function toonHuidiglocatieInFormulier() {

    let parameters = {
        "endpoint": endpoint, 
        "project": project,
        "token": token, 
        "entity": "locatie",
        "filter": ["locatie_id", "=", huidige_locatie_id]
    }
    
    dwapiRead(parameters).then(
        data => {
            let locatie = data.result.items[0];

            document.getElementById("input_locatie_naam").value = locatie.naam_campus;
            document.getElementById("input_locatie_adres").value = locatie.adres;
            document.getElementById("input_locatie_postcode").value = locatie.postcode;
            document.getElementById("input_locatie_stad").value = locatie.stad;
        }); 
}

function resetlocatieFormulier() {
    document.getElementById("input_locatie_naam").value = "";
    document.getElementById("input_locatie_adres").value = "";
    document.getElementById("input_locatie_postcode").value = "";
    document.getElementById("input_locatie_stad").value = "";
    
  
    document.getElementById("label_locatie_fout").classList.remove("visible");
    document.getElementById("label_locatie_fout").classList.add("invisible");
}

function toonSorteerRichting() {
    // De arrow-up en arrow-down class van alle sorteer links verwijderen
    let alle_sorteer_links = document.querySelectorAll('.link-locaties-sorteren');
    for (var i = 0; i < alle_sorteer_links.length; i++) {
        let icon = alle_sorteer_links[i].getElementsByTagName("i")[0];
        icon.classList.remove("fa-arrow-up");
        icon.classList.remove("fa-arrow-down");
    }

    // Op de link van de huidige sortering de arrow-up of arrow-down class toevoegen
    let link = document.getElementById("link_sorteer_op_" + huidige_sorteer_waarde[0]);
    let icon = link.getElementsByTagName("i")[0];
    if (huidige_sorteer_waarde[1] == "ASC") {
        icon.classList.add("fa-arrow-down");
    }
    else {
        icon.classList.add("fa-arrow-up");
    }
}

function verwerkResultaatNaLocatieActie(resultaat, modal_id) {

    if (resultaat.status.success == true) {                         
        toonLocatiesTabel();
        $("#" + modal_id).modal('hide');
        $("#success").modal('hide');
    }
    else {
        label_fout = document.getElementById(modal_id).getElementsByClassName("note-danger")[0];
        label_fout.innerHTML = resultaat.status.message;
        label_fout.classList.remove("invisible");
        label_fout.classList.add("visible");
    }
}