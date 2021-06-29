const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo2LCJleHAiOjE2MjQ5ODg2MjQsImlzcyI6IjRucW1sUkFpRTVjRyIsImlhdCI6MTYyNDk1MjYyNH0.LfLNZxFzMbipADXygMXoNMQo5yiXlLtuxekPTsFiY7Q";
const endpoint = "https://dwapi.dev/item";
const project = "4nqmlRAiE5cG";

let huidige_categorie_actie;
let huidige_categorie_id;
let huidige_filter_waardes = [];
let huidige_sorteer_waarde = ["naam", "ASC"];

window.onload = function(){
    toonCategorieënTabel();
    toonSorteerRichting();
    eventListenersVoorStatischeElementen();
   // categorieenLadenInSelects();
}

function toonCategorieënTabel() {
    let parameters = {
        "endpoint": endpoint, 
        "project": project,
        "token": token, 
        "entity": "categorie",
        "filter": huidige_filter_waardes,
        "sort": huidige_sorteer_waarde
    }
    
    dwapiRead(parameters).then(
        data => {
            let tabel_categorieën_html =  "<table>";
            data.result.items.forEach(function(categorie) {

                tabel_categorieën_html += `<tr><td>${categorie.categorie_id}</td>
                    <td>${categorie.naam}</td>  
                    <td>${categorie.omschrijving}</td> 
                    <td>
                    <button data-categorie-id='${categorie.categorie_id}' 
                    data-categorie-actie='update' class='button-toon-categorie-modal waves-effect'
                    data-toggle='modal' data-target='#modal_categorie'><i class='fa fa-edit bg-edit'></i></button>
                    <button data-categorie-id='${categorie.categorie_id}'
                    data-categorie-naam='${categorie.naam}'
                    data-toggle='modal' data-target='#modal_categorie_verwijderen'>
                    <i class='fa fa-trash bg-remove'></i>
                    </button></td></tr></tbody>`;
                });
            tabel_categorieën_html += "</table>";
            document.getElementById("tabel_categorieën").innerHTML = tabel_categorieën_html;
            eventListenersVoorDynamischeElementen();            
       }
    )
}


function categorieBewaren() {
    // INVOER
    let categorie_naam = document.getElementById("input_categorie_naam").value;
    let categorie_omschrijving = document.getElementById("input_categorie_omschrijving").value;

console.log(categorie_naam, categorie_omschrijving);
    // VERWERJING
    let form_categorie = document.getElementById("form_categorie");
    if (form_categorie.checkValidity()) {
        let categorie = {
            "naam": categorie_naam, 
            "omschrijving": categorie_omschrijving, 
        };
 
        let parameters = {
            "endpoint": endpoint, 
            "project": project,
            "token": token, 
            "entity": "categorie",
            "values": categorie};

        if (huidige_categorie_actie == "update") {
            parameters.filter = ["categorie_id", "=", huidige_categorie_id];
            dwapiUpdate(parameters).then(
                resultaat => {
                    // UITVOER
                    verwerkResultaatNaCategorieActie(resultaat, "modal_categorie");                    
                }
            )
        }
        else {
            dwapiCreate(parameters).then(
                resultaat => {
                    // UITVOER
                    verwerkResultaatNaCategorieActie(resultaat, "modal_categorie");
                }
            )
        }
    }
    else {
        // UITVOER
        form_categorie.classList.add('was-validated');
    }
}

function categorieVerwijderen(categorie_id) {
    // INVOER
    let parameters = {
        "endpoint": endpoint, 
        "project": project,
        "token": token, 
        "entity": "categorie",
        "filter": ["categorie_id", "=", categorie_id]}

    // VERWERKING
    dwapiDelete(parameters).then(
        resultaat => {
            verwerkResultaatNaCategorieActie(resultaat, "modal_categorie_verwijderen");
        }
    )
}

function categorieënFilteren() {
    // INVOER
    huidige_filter_waardes = [];
    let filter_naam = document.getElementById("input_filter_categorie").value;

    // VERWERKING
    if (String(filter_naam) != "") {
        huidige_filter_waardes.push(["naam", "LIKE", "%" + filter_naam + "%"]);
    }
    
    // UITVOER
    toonCategorieënTabel();
}

function categorieënSorteren(link) {
    // INVOER
    let sorteer_op = link.dataset.sorteerOp;


    // VERWERKING    
    let sorteer_richting = "ASC";
    if (huidige_sorteer_waarde[0] == sorteer_op && huidige_sorteer_waarde[1] == "ASC") {
        sorteer_richting = "DESC";
    }
    
    huidige_sorteer_waarde = [sorteer_op, sorteer_richting];
    
    // UITVOER
    toonCategorieënTabel();
    toonSorteerRichting();
}

// ------------------ //

function eventListenersVoorStatischeElementen() {

    document.getElementById("button_categorie_bewaren").addEventListener('click', function() {
        categorieBewaren();
    })

    document.getElementById("button_categorie_verwijderen").addEventListener('click', function() {
        categorieVerwijderen(huidige_categorie_id);
    })

    document.getElementById("button_categorie_zoek").addEventListener('click', function() {
        categorieënFilteren();
    })

    let sorteer_links;
    sorteer_links = document.querySelectorAll('.link-categorieën-sorteren');
    for (var i = 0; i < sorteer_links.length; i++) {
        sorteer_links[i].addEventListener('click', function() {            
            categorieënSorteren(this);
        })
    }
}

function eventListenersVoorDynamischeElementen() {
    /* "categorie toevoegen" knop (statisch) en "categorie wijzigen" knoppen (dynamisch) */
    let toon_categorie_modal_buttons;
    toon_categorie_modal_buttons = document.querySelectorAll('.button-toon-categorie-modal');
    if (toon_categorie_modal_buttons) {
        for (var i = 0; i < toon_categorie_modal_buttons.length; i++) {
            toon_categorie_modal_buttons[i].addEventListener('click', function() {            
                toonCategorieModal(this);
            });            
        }        
    }

    /* "categorie verwijderen" knoppen */
    buttons = document.querySelectorAll('.button-toon-categorie-verwijderen-modal');
    if (buttons) {
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', function() {                
                toonCategorieVerwijderenModal(this);
            });            
        }           
    }
}

function toonCategorieModal(via_button) {

    // INVOER
    huidige_categorie_actie = via_button.dataset.categorieActie;
    huidige_categorie_id = via_button.dataset.categorieId;
 
    // UITVOER
    resetCategorieFormulier();  
    if (huidige_categorie_actie == "create") {
        document.getElementById("modal_categorie_titel").innerHTML = "Nieuw categorie toevoegen";
    }
    if (huidige_categorie_actie == "update") {
        document.getElementById("modal_categorie_titel").innerHTML = "Categorie wijzigen";
        toonHuidigCategorieInFormulier();
    }

    // verwijder vorige validatie
    document.getElementById("form_categorie").classList.remove('was-validated');
}

function toonCategorieVerwijderenModal(via_button) {
    // VERWERKING
    huidige_categorie_id = via_button.dataset.categorieId;

    // UITVOER
    document.getElementById("label_categorie_verwijderen").innerHTML = "Wil u categorie <strong>" + via_button.dataset.categorieNaam + "</strong> echt verwijderen?";
}


function toonHuidigCategorieInFormulier() {

    let parameters = {
        "endpoint": endpoint, 
        "project": project,
        "token": token, 
        "entity": "categorie",
        "filter": ["categorie_id", "=", huidige_categorie_id]
    }
    
    dwapiRead(parameters).then(
        data => {
            let categorie = data.result.items[0];
            document.getElementById("input_categorie_naam").value = categorie.naam;
            document.getElementById("input_categorie_omschrijving").value = categorie.omschrijving;
        }); 
}

function resetCategorieFormulier() {
    document.getElementById("input_categorie_naam").value = "";
    document.getElementById("input_categorie_omschrijving").value = "";

  
    document.getElementById("label_categorie_fout").classList.remove("visible");
    document.getElementById("label_categorie_fout").classList.add("invisible");
}

function toonSorteerRichting() {
    // De arrow-up en arrow-down class van alle sorteer links verwijderen
    let alle_sorteer_links = document.querySelectorAll('.link-categorieën-sorteren');
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

function verwerkResultaatNaCategorieActie(resultaat, modal_id) {
      console.log(resultaat.status, modal_id);
    if (resultaat.status.success == true) {                              
        toonCategorieënTabel();
        $("#" + modal_id).modal('hide');
    }
    else {
        label_fout = document.getElementById(modal_id).getElementsByClassName("note-danger")[0];
        label_fout.innerHTML = resultaat.status.message;
        label_fout.classList.remove("invisible");
        label_fout.classList.add("visible");
    }
}