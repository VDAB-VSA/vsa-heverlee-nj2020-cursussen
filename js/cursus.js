const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo2LCJleHAiOjE2MjQ5ODg2MjQsImlzcyI6IjRucW1sUkFpRTVjRyIsImlhdCI6MTYyNDk1MjYyNH0.LfLNZxFzMbipADXygMXoNMQo5yiXlLtuxekPTsFiY7Q";
const endpoint = "https://dwapi.dev/item";
const project = "4nqmlRAiE5cG";

let huidige_cursus_actie;
let huidige_cursus_id;
let huidige_filter_waardes = [];
let huidige_sorteer_waarde = ["cursus_id", "ASC"];
//let profiel_naam = `<h5>Beheerder<span>Welkom</span></h5>`;


window.onload = function(){
    checkSessie();
    toonCursussenTabel();
    toonSorteerRichting();
    eventListenersVoorStatischeElementen();
    categorieenLadenInSelects();
    locatiesLadenInSelects();
}
function checkSessie() {
let gebruiker = JSON.parse(window.sessionStorage.getItem("user"));
console.log(gebruiker);
//console.log('sess', gebruiker);
  if(gebruiker == null){
   /*  let session = gebruiker[0].token != null ? "true" : "false";
    if(session == false) {
      //alert("Your Session has expired");
      window.location.replace("index.html");
    }
  }
  else { */
  //setTimeout(() => redirectMessage, 40000);
  window.location = "index.html";
  }
}
function toonCursussenTabel() {
    //INVOER
    //gebruikerProfiel();
    
    let parameters = {
        "endpoint": endpoint, 
        "project": project,
        "token": token, 
        "entity": "cursus",
        "filter": huidige_filter_waardes,
        "sort": huidige_sorteer_waarde,
        "relation": [{"pri_entity": "cursus", "pri_key": "categorie_id", "sec_entity": "categorie", "sec_key": "categorie_id"}, {"pri_entity": "cursus", "pri_key": "locatie_id", "sec_entity": "locatie", "sec_key": "locatie_id"}],
     }

   
    dwapiRead(parameters).then(
        data => {
            let tabel_cursussen_html =  "<table>";
            //console.log(data.result.assets_path);
            data.result.items.forEach(function(cursus) {
                let locatie_naam = "";
                let categorie_naam = "";
                if (cursus.locatie_id != null) {
                    locatie_naam = cursus.locatie.items[cursus.locatie_id].naam_campus;
                }
                if (cursus.categorie_id != null) {
                  categorie_naam = cursus.categorie.items[cursus.categorie_id].naam;
                }
                tabel_cursussen_html += "<tr>"+
                    "<td>" + cursus.cursus_id + "</td>" +
                    "<td>" + cursus.titel + "</td>" + 
                    "<td>" + categorie_naam + "</td>" +
                    "<td>" + locatie_naam + "</td>" +  
                    "<td>" + cursus.docent + "</td>" +
                    "<td>" + cursus.max_aantal_plaatsen + "</td>" + 
                    "<td>" + cursus.aantal_lesuren + "</td>" +
                    "<td>" + cursus.startdatum + "</td>" + 
                    "<td>" + cursus.einddatum + "</td>" + 
                    "<td>"+
                    "<button "+
                    "data-cursus-id='" + cursus.cursus_id + "' "+ 
                    "data-cursus-actie='update' " +
                    "class='button-toon-cursus-modal btn btn-outline-primary' "+
                    "data-mdb-ripple-color='dark'" +
                    "data-mdb-toggle='modal' " +
                    "data-mdb-target='#modal_cursus'>" +
                    "<i class='fa fa-pen'></i>" +
                    "</button>" +
                    "<button " +
                    "data-cursus-id='" + cursus.cursus_id + "' " +
                    "data-cursus-naam='" + cursus.titel + "' " +
                    "class='button-toon-cursus-verwijderen-modal btn btn-outline-danger'" +
                    "data-mdb-ripple-color='dark'" +
                    "data-mdb-toggle='modal' " +
                    "data-mdb-target='#modal_cursus_verwijderen'>" + 
                    "<i class='fa fa-trash'></i>" +
                     "</button>" + "</td>" + "</tr>";
                });
           // tabel_cursussen_html += "</table>";
           //console.log(tabel_cursussen_html);
            document.getElementById("tabel_cursussen").innerHTML = tabel_cursussen_html;
            eventListenersVoorDynamischeElementen();            
       }
    )
}

function cursusBewaren() {
    // INVOER
   let cursus_naam = document.getElementById("input_cursus_naam").value;
   let cursus_locatie = document.getElementById("select_cursus_locatie").value;
   let cursus_categorie = document.getElementById("select_cursus_categorie").value;
   let cursus_prijs = document.getElementById("input_cursus_prijs").value;
   let cursus_earlybird = document.getElementById("input_cursus_earlybird").value;
   let cursus_docent = document.getElementById("input_cursus_docent").value;
   let cursus_start = document.getElementById("input_cursus_start").value;
   let cursus_eind = document.getElementById("input_cursus_eind").value;
   let cursus_uren = document.getElementById("input_cursus_uren").value;
   let cursus_omschrijving = document.getElementById("input_cursus_omschrijving").value;
   let cursus_plastsen = document.getElementById("input_cursus_platsen").value;
   let cursus_beeld_origineel = document.getElementById("input_cursus_beeld_origineel").value;
   let beeld = document.getElementById("input_cursus_beeld");
   let cursus_verkoop = document.getElementById("check_cursus_in_verkoop").checked;

    // VERWERJING
   if (cursus_verkoop == true) {
    cursus_verkoop = 1;
        }
    else {
        cursus_verkoop = 0;
    }

    let cursus_beeld;
    if (beeld.files.length == 1) {
        cursus_beeld = beeld.files[0];
    }
    else {
        cursus_beeld = cursus_beeld_origineel;
    }

    let form_cursus = document.getElementById("form_cursus");
    if (form_cursus.checkValidity()) {
        let cursus = {
            "titel": cursus_naam, 
            "locatie_id": cursus_locatie, 
            "categorie_id": cursus_categorie, 
            "prijs": cursus_prijs,
            "earlybird": cursus_earlybird,
            "docent": cursus_docent,
            "startdatum": cursus_start,
            "einddatum": cursus_eind,
            "aantal_lesuren": cursus_uren,
            "omschrijving": cursus_omschrijving,
            "max_aantal_plaatsen": cursus_plastsen,
            "afbeelding": cursus_beeld,
            "in_verkoop": cursus_verkoop 
        };
       console.log(cursus);
        let parameters = {
            "endpoint": endpoint, 
            "project": project,
            "token": token, 
            "entity": "cursus",
            "values": cursus};
        
        if (huidige_cursus_actie == "update") {
            parameters.filter = ["cursus_id", "=", huidige_cursus_id];
            dwapiUpdate(parameters).then(
                resultaat => {
                    // UITVOER
                    verwerkResultaatNaCursusActie(resultaat, "modal_cursus");                    
                }
            )
        }
        else {
            dwapiCreate(parameters).then(
                resultaat => {
                    // UITVOER
                    verwerkResultaatNaCursusActie(resultaat, "modal_cursus");
                }
            )
        }
    }
    else {
        // UITVOER
        form_cursus.classList.add('was-validated');
    }
}

function cursusVerwijderen(cursus_id) {
    // INVOER
    let parameters = {
        "endpoint": endpoint, 
        "project": project,
        "token": token, 
        "entity": "cursus",
        "filter": ["cursus_id", "=", cursus_id]
    }

    // VERWERKING
    dwapiDelete(parameters).then(
        resultaat => {
            verwerkResultaatNaCursusActie(resultaat, "modal_cursus_verwijderen");
        }
    )
}

function cursussenFilteren() {
    // INVOER
    huidige_filter_waardes = [];
    let filter_naam = document.getElementById("input_filter_cursus").value;
    let filter_docent = document.getElementById("input_filter_docent").value;
    let filter_datum = document.getElementById("input_filter_datum").value;

    // VERWERKING
    if (String(filter_naam) != "") {
        huidige_filter_waardes.push(["titel", "LIKE", "%" + filter_naam + "%"]);
    }
    if (String(filter_docent) != "") {
        huidige_filter_waardes.push(["docent", "=", filter_docent]);
    }
    if (String(filter_datum) != "") {
        huidige_filter_waardes.push(["startdatum", "=", filter_datum]);
    }
    
    // UITVOER
    toonCursussenTabel();
}

function cursussenSorteren(link) {
    // INVOER
    let sorteer_op = link.dataset.sorteerOp;

    // VERWERKING    
    let sorteer_richting = "ASC";
    if (huidige_sorteer_waarde[0] == sorteer_op && huidige_sorteer_waarde[1] == "ASC") {
        sorteer_richting = "DESC";
    }
    
    huidige_sorteer_waarde = [sorteer_op, sorteer_richting];
    
    // UITVOER
    toonCursussenTabel();
    toonSorteerRichting();
}

// ------------------ //

function eventListenersVoorStatischeElementen() {
    let cursus_bewaren = document.getElementById("button_cursus_bewaren");
    if(cursus_bewaren){
        cursus_bewaren.addEventListener('click', function() {
            cursusBewaren();
        })
    }
    let cursus_verwijdren = document.getElementById("button_cursus_verwijderen");
    if(cursus_verwijdren){
        cursus_verwijdren.addEventListener('click', function() {
            cursusVerwijderen(huidige_cursus_id);
        })
    }
    let cursus_zoek = document.getElementById("button_cursus_zoek");
    if(cursus_zoek){
        cursus_zoek.addEventListener('click', function() {
            cursussenFilteren();
        })
    }
 
    let sorteer_links;
    sorteer_links = document.querySelectorAll('.link-cursussen-sorteren');
    for (var i = 0; i < sorteer_links.length; i++) {
        sorteer_links[i].addEventListener('click', function() {     
            cursussenSorteren(this);
        })
    }
}

function eventListenersVoorDynamischeElementen() {
    let toon_cursus_modal_buttons;
    toon_cursus_modal_buttons = document.querySelectorAll('.button-toon-cursus-modal');
    if (toon_cursus_modal_buttons) {
        for (var i = 0; i < toon_cursus_modal_buttons.length; i++) {
            toon_cursus_modal_buttons[i].addEventListener('click', function() {            
                toonCursusModal(this);
            });            
        }        
    }

    buttons = document.querySelectorAll('.button-toon-cursus-verwijderen-modal');
    if (buttons) {
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', function() {               
                toonCursusVerwijderenModal(this);
            });            
        }           
    }
}

function categorieenLadenInSelects() {
    let parameters = {
        "endpoint": endpoint, 
        "project": project,
        "token": token, 
        "entity": "categorie"
    }
    
    dwapiRead(parameters).then(
        data => {
            
            let select_categorie = document.getElementById('select_categorie');
            let categorie_opties = `<label class="form-label" for="select_cursus_categorie">Categorie</label>
            <select required id="select_cursus_categorie" class="form-control select-input rounded">`;
                data.result.items.forEach(function(categorie) {
                    categorie_opties += "<option value='" + categorie.categorie_id + "'>" + categorie.naam + "</option>";
                });
                categorie_opties += `</select><div class="invalid-feedback">Een categorie is verplicht.</div>`;
            select_categorie.innerHTML = categorie_opties;
})}
function gebruikerProfiel(){
       
   /* let gebruiker = JSON.parse(window.sessionStorage.getItem("user")) || [];
    (gebruiker.length > 0) ? profiel_naam = `<h5>${gebruiker[0].voornaam}<span> ${gebruiker[0].naam}</span></h5>` : false;
    
   
    return profiel_naam;
    //return profiel_naam;*/
}

function locatiesLadenInSelects() {
    let parameters = {
        "endpoint": endpoint, 
        "project": project,
        "token": token, 
        "entity": "locatie"
    }
    
    dwapiRead(parameters).then(
        data => {
            let select_locatie = document.getElementById('select_locatie');
            let locatie_opties = `<label class="form-label" for="select_cursus_locatie">Locatie</label>
            <select required id="select_cursus_locatie" class="form-control select-input rounded">`;
                data.result.items.forEach(function(locatie) {
                    locatie_opties += "<option value='" + locatie.locatie_id + "'>" + locatie.naam_campus + "</option>";
                });
                locatie_opties += `</select><div class="invalid-feedback">Een locatie is verplicht.</div>`;
            select_locatie.innerHTML = locatie_opties;   
        });
}

function toonCursusModal(via_button) {

    // INVOER
    huidige_cursus_actie = via_button.dataset.cursusActie;
    huidige_cursus_id = via_button.dataset.cursusId;

    // UITVOER
     resetCursusFormulier();  
    if (huidige_cursus_actie == "update") {
        document.getElementById("modal_cursus_titel").innerHTML = "Cursus wijzigen";
        toonHuidigCursusInFormulier();
    }
    else {
        document.getElementById("modal_cursus_titel").innerHTML = "Nieuw cursus toevoegen";
    }

    // verwijder vorige validatie
    document.getElementById("form_cursus").classList.remove('was-validated');
}

function toonCursusVerwijderenModal(via_button) {
    // VERWERKING
    huidige_cursus_id = via_button.dataset.cursusId;
    
    // UITVOER
    document.getElementById("label_cursus_verwijderen").innerHTML = "Wil u cursus <strong>" + via_button.dataset.cursusNaam + "</strong> echt verwijderen?";
}


function toonHuidigCursusInFormulier() {

    let parameters = {
        "endpoint": endpoint, 
        "project": project,
        "token": token, 
        "entity": "cursus",
        "filter": ["cursus_id", "=", huidige_cursus_id]
    }
    
    dwapiRead(parameters).then(
        data => {
            let cursus = data.result.items[0];

            document.getElementById("input_cursus_naam").value = cursus.titel;
            document.getElementById("select_cursus_locatie").value = cursus.locatie_id;
            document.getElementById("select_cursus_categorie").value = cursus.categorie_id;
            document.getElementById("input_cursus_prijs").value = cursus.prijs;
            document.getElementById("input_cursus_earlybird").value = cursus.earlybird;
            document.getElementById("input_cursus_docent").value = cursus.docent;
            document.getElementById("input_cursus_start").value = cursus.startdatum;
            document.getElementById("input_cursus_eind").value = cursus.einddatum;
            document.getElementById("input_cursus_uren").value = cursus.aantal_lesuren;
            document.getElementById("input_cursus_omschrijving").value = cursus.omschrijving;
            document.getElementById("input_cursus_platsen").value = cursus.max_aantal_plaatsen;
            console.log(cursus.afbeelding);
            let cursus_beeld_origineel = "";
            if (cursus.afbeelding != "") {
                cursus_beeld_origineel = JSON.stringify(cursus.afbeelding);
            }         
            document.getElementById("input_cursus_beeld_origineel").value = cursus_beeld_origineel;
            //document.getElementById("input_cursus_beeld").value = cursus.afbeelding;
            document.getElementById("check_cursus_in_verkoop").checked = cursus.in_verkoop;//cursus.in_verkoop;
        }); 
}

function resetCursusFormulier() {
    document.getElementById("input_cursus_naam").value = "";
    document.getElementById("select_cursus_locatie").value = "";
    document.getElementById("select_cursus_categorie").value = "";
    document.getElementById("input_cursus_prijs").value = "";
    document.getElementById("input_cursus_earlybird").value = "";
    document.getElementById("input_cursus_docent").value = "";
    document.getElementById("input_cursus_start").value = "";
    document.getElementById("input_cursus_eind").value = "";
    document.getElementById("input_cursus_uren").value = "";
    document.getElementById("input_cursus_omschrijving").value = "";
    document.getElementById("input_cursus_platsen").value = "";
    document.getElementById("input_cursus_beeld").value = "";
  
    document.getElementById("label_cursus_fout").classList.remove("visible");
    document.getElementById("label_cursus_fout").classList.add("invisible");
}

function toonSorteerRichting() {
    // De arrow-up en arrow-down class van alle sorteer links verwijderen
    let alle_sorteer_links = document.querySelectorAll('.link-cursussen-sorteren');
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

function verwerkResultaatNaCursusActie(resultaat, modal_id) {

    if (resultaat.status.success == true) {                              
        toonCursussenTabel();
        $("#" + modal_id).modal('hide');
    }
    else {
        label_fout = document.getElementById(modal_id).getElementsByClassName("note-danger")[0];
        label_fout.innerHTML = resultaat.status.message;
        label_fout.classList.remove("invisible");
        label_fout.classList.add("visible");
    }
}