const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo2LCJleHAiOjE2MjQ5ODg2MjQsImlzcyI6IjRucW1sUkFpRTVjRyIsImlhdCI6MTYyNDk1MjYyNH0.LfLNZxFzMbipADXygMXoNMQo5yiXlLtuxekPTsFiY7Q";
const endpoint = "https://dwapi.dev/item";
const project = "4nqmlRAiE5cG";

let huidige_cursus_actie;
let huidige_cursus_id;
let huidige_filter_waardes = [];
let huidige_sorteer_waarde = ["aankoop_id", "ASC"];

window.onload = function(){
    toonCursussenTabel();
    toonSorteerRichting();
    eventListenersVoorStatischeElementen();
}
function toonCursussenTabel() {
    let parameters = {
        "endpoint": endpoint, 
        "project": project,
        "token": token, 
        "entity": "aankoop",
        "filter": huidige_filter_waardes,
        "sort": huidige_sorteer_waarde,
        "relation": [{"pri_entity": "aankoop", "pri_key": "user_id", "sec_entity": "user", "sec_key": "user_id"}, {"pri_entity": "aankoop", "pri_key": "aankoop_id", "sec_entity": "aankoop_cursus", "sec_key": "aankoop_id"}, {"pri_entity": "aankoop_cursus", "pri_key": "cursus_id", "sec_entity": "cursus", "sec_key": "cursus_id"}],
        //"relation": [{"pri_entity": "aankoop_cursus", "pri_key": "aankoop_id", "sec_entity": "aankoop", "sec_key": "aankoop_id"}, {"pri_entity": "aankoop_cursus", "pri_key": "cursus_id", "sec_entity": "cursus", "sec_key": "cursus_id"}, {"pri_entity": "aankoop", "pri_key": "user_id", "sec_entity": "user", "sec_key": "user_id"}],
     }
    
    dwapiRead(parameters).then(
        aankopen => {
            let tabel_aankoop_html =  "<table>";
             console.log(aankopen.result);
            aankopen.result.items.forEach(function(aankoop) {
                
                let user_naam = "";
                let cursus_naam = "";
                if (aankoop.aankoop_id != null) {
                    let naam = aankoop.user.items[aankoop.user_id].naam;
                    let voornaam = aankoop.user.items[aankoop.user_id].voornaam;
                    //let cursus_naam = aankoop_cursus.cursus.items[aankoop_cursus.cursus_id].titel;
                    //console.log(aankoop_cursus.aankoop.items[aankoop_id].user.items);
                    //console.log(aankoop_id, cursus_id);
                    //let voornaam = aankoop.user.items[aankoop.user_id].voornaam;
                    user_naam = voornaam + "," + naam;
                    //let aa = [];
                    //console.log(aankoop);
                    //for(let i=0; i<)
                    //aa.push(aankoop.aankoop_cursus.items.forEach(cc => {
                      //  console.log(cc);
                    //}));

                    //let aa = 
                    /*aankoop.aankoop_cursus.items[aankoop.aankoop_id].cursus.items.forEach(function(aa){
                        //
                        console.log(aa);
                    });*/
                 
                    /*.map(function(cursus) {
                         console.log(cursus);*/
                    
                    //console.log(aa);
                    //[aankoop.aankoop_id].cursus.titel;
                    //console.log(cursus_naam);*/
                    cursus_naam = "my courses";
                }
                //let cursus = aankoop.aankoop_cursus.items[aankoop.aankoop_id].cursus_id;

                tabel_aankoop_html += "<tr>"+
                    "<td>" + aankoop.aankoop_id + "</td>" +
                    "<td>" + user_naam + "</td>" + 
                    "<td>€" + aankoop.subtotaal + "</td>" +
                    "<td>€" + aankoop.btw + "</td>" + 
                    "<td>€" + aankoop.totaal_bedrag + "</td>" + 
                    "<td>" + aankoop.aankoop_datum + "</td>" +  
                    "<td>" + aankoop.betaal_status + "</td>" +
                    "<td>" + aankoop.betaal_datum + "</td>" + 
                    "<td>"+
                    "<button "+
                    "data-cursus-id='" + aankoop.aankoop_id + "' "+ 
                    "data-cursus-actie='update' " +
                    "class='button-toon-aanloop-modal btn btn-info' "+
                    "data-mdb-ripple-color='dark'" +
                    "data-mdb-toggle='modal' " +
                    "data-mdb-target='#modal_aankoop'>" +
                    "<i class='fa fa-print'></i>" +
                    "</button>"
                    + "</td>" + "</tr>" +
                    `<tr><td colspan="9" class="text-primary">Cursus ${cursus_naam}</td></tr>`;
                });
           // tabel_cursussen_html += "</table>";
            document.getElementById("tabel_aankopen").innerHTML = tabel_aankoop_html;
            eventListenersVoorDynamischeElementen();            
       }
    )
}

/*function toonCursussenTabel() {
    let parameters = {
        "endpoint": endpoint, 
        "project": project,
        "token": token, 
        "entity": "aankoop",
        "filter": huidige_filter_waardes,
        "sort": huidige_sorteer_waarde,
        "relation": [{"pri_entity": "aankoop", "pri_key": "user_id", "sec_entity": "user", "sec_key": "user_id"}, {"pri_entity": "aankoop", "pri_key": "aankoop_id", "sec_entity": "aankoop_cursus", "sec_key": "aankoop_id"}, {"pri_entity": "cursus", "pri_key": "cursus_id", "sec_entity": "aankoop_cursus", "sec_key": "cursus_id"}],
     }
    
    dwapiRead(parameters).then(
        data => {
            let tabel_aankoop_html =  "<table>";

            data.result.items.forEach(function(aankoop) {
                let user_naam = "";
                if (aankoop.user_id != null) {
                    let naam = aankoop.user.items[aankoop.user_id].naam;
                    let voornaam = aankoop.user.items[aankoop.user_id].voornaam;
                    user_naam = voornaam + "," + naam;
                }
                let cursus = aankoop.aankoop_cursus.items[aankoop.aankoop_id].cursus_id;

                tabel_aankoop_html += "<tr>"+
                    "<td>" + aankoop.aankoop_id + "</td>" +
                    "<td>" + user_naam + "</td>" + 
                    "<td>€" + aankoop.subtotaal + "</td>" +
                    "<td>€" + aankoop.btw + "</td>" + 
                    "<td>€" + aankoop.totaal_bedrag + "</td>" + 
                    "<td>" + aankoop.aankoop_datum + "</td>" +  
                    "<td>" + aankoop.betaal_status + "</td>" +
                    "<td>" + aankoop.betaal_datum + "</td>" + 
                    "<td>"+
                    "<button "+
                    "data-cursus-id='" + aankoop.aankoop_id + "' "+ 
                    "data-cursus-actie='update' " +
                    "class='button-toon-aanloop-modal btn btn-info' "+
                    "data-mdb-ripple-color='dark'" +
                    "data-mdb-toggle='modal' " +
                    "data-mdb-target='#modal_aankoop'>" +
                    "<i class='fa fa-print'></i>" +
                    "</button>"
                    + "</td>" + "</tr>" +
                    `<tr><td colspan="9">Cursus ${cursus}</td></tr>`;
                });
           // tabel_cursussen_html += "</table>";
            document.getElementById("tabel_aankopen").innerHTML = tabel_aankoop_html;
            eventListenersVoorDynamischeElementen();            
       }
    )
}*/

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

        let parameters = {
            "endpoint": endpoint, 
            "project": project,
            "token": token, 
            "entity": "aankoop",
            "values": cursus};
        
        if (huidige_cursus_actie == "update") {
            parameters.filter = ["aankoop_id", "=", huidige_cursus_id];
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
    let filter_naam = document.getElementById("input_filter_bestelling").value;


    // VERWERKING
    if (String(filter_naam) != "") {
        huidige_filter_waardes.push(["aankoop_id", "=", filter_naam]);
        //huidige_filter_waardes.push(["prijs", "=", filter_naam]);
        //huidige_filter_waardes.push(["aankoop_datum", "=", filter_naam]);
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

    document.getElementById("print").addEventListener('click', function() {
        cursusBewaren();
    })

    document.getElementById("button_cursus_verwijderen").addEventListener('click', function() {
        cursusVerwijderen(huidige_cursus_id);
    })

    document.getElementById("button_bestelling_zoek").addEventListener('click', function() {
        cursussenFilteren();
    })

    let sorteer_links;
    sorteer_links = document.querySelectorAll('.link-cursussen-sorteren');
    for (var i = 0; i < sorteer_links.length; i++) {
        sorteer_links[i].addEventListener('click', function() {     
            cursussenSorteren(this);
        })
    }
}

function eventListenersVoorDynamischeElementen() {
    /* "locatie toevoegen" knop (statisch) en "locatie wijzigen" knoppen (dynamisch) */
    let toon_cursus_modal_buttons;
    toon_cursus_modal_buttons = document.querySelectorAll('.button-toon-cursus-modal');
    if (toon_cursus_modal_buttons) {
        for (var i = 0; i < toon_cursus_modal_buttons.length; i++) {
            toon_cursus_modal_buttons[i].addEventListener('click', function() {            
                toonCursusModal(this);
            });            
        }        
    }

    /* "locatie verwijderen" knoppen */
    buttons = document.querySelectorAll('.button-toon-cursus-verwijderen-modal');
    if (buttons) {
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', function() {               
                toonCursusVerwijderenModal(this);
            });            
        }           
    }
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