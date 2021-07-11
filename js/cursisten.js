//const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo2LCJleHAiOjE2MjQ5ODg2MjQsImlzcyI6IjRucW1sUkFpRTVjRyIsImlhdCI6MTYyNDk1MjYyNH0.LfLNZxFzMbipADXygMXoNMQo5yiXlLtuxekPTsFiY7Q";
//const endpoint = "https://dwapi.dev/item";
//const project = "4nqmlRAiE5cG";

let huidige_cursist_actie;
let huidge_cursist_id;
let huidige_filter_waardes = ["rol", "=", "Cursist"];
let huidige_sorteer_waarde = ["user_id", "ASC"];
//let profiel_naam = `<h5>Beheerder<span>Welkom</span></h5>`;


window.onload = function(){
    checkSessie();
    toonCursistenTabel();
    toonSorteerRichting();
    eventListenersVoorStatischeElementen();
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
function toonCursistenTabel() {
    //INVOER
    //gebruikerProfiel();
    
    let parameters = {
        "endpoint": endpoint, 
        "project": project,
        "token": token, 
        "entity": "user",
        "filter": huidige_filter_waardes,
        "sort": huidige_sorteer_waarde
     }

   
    dwapiRead(parameters).then(
        data => {
            console.log(data);
            let tabel_cursisten_html =  "<table>";
            //console.log(data.result.assets_path);
            data.result.items.forEach(function(gebruiker) {
                let locatie_naam = "";
                let categorie_naam = "";
               /* if (gebruiker.user_id != null) {
                    locatie_naam = cursist.locatie.items[cursist.locatie_id].naam_campus;
                }
                if (cursist.categorie_id != null) {
                  categorie_naam = cursist.categorie.items[cursist.categorie_id].naam;
                }*/
                tabel_cursisten_html += "<tr>"+
                    "<td>" + gebruiker.user_id + "</td>" +
                    "<td>" + gebruiker.voornaam + "</td>" + 
                    "<td>" + gebruiker.naam + "</td>" + 
                    "<td>" + gebruiker.email + "</td>" + 
                    "<td>" + gebruiker.telefoon + "</td>" + 
                    "<td>" + gebruiker.adres + "</td>" + 
                    "<td>" + gebruiker.stad + "</td>" +  
                    "<td>" + gebruiker.rol + "</td>" + 
                    "<td>"+
                    "<button "+
                    "data-cursist-id='" + gebruiker.user_id + "' "+ 
                    "data-cursist-actie='update' " +
                    "class='button-toon-cursist-modal btn btn-outline-primary invisible' "+
                    "data-mdb-ripple-color='dark'" +
                    "data-mdb-toggle='modal' " +
                    "data-mdb-target='#modal_cursist'>" +
                    "<i class='fa fa-pen'></i>" +
                    "</button>" +
                    "<button " +
                    "data-cursist-id='" + gebruiker.user_id + "' " +
                    "data-cursist-naam='" + gebruiker.voornaam + "' " +
                    "class='button-toon-cursist-verwijderen-modal btn btn-outline-danger'" +
                    "data-mdb-ripple-color='dark'" +
                    "data-mdb-toggle='modal' " +
                    "data-mdb-target='#modal_cursist_verwijderen'>" + 
                    "<i class='fa fa-trash'></i>" +
                     "</button>" + "</td>" + "</tr>";
                });
           // tabel_cursisten_html += "</table>";
           //console.log(tabel_cursisten_html);
            document.getElementById("tabel_cursisten").innerHTML = tabel_cursisten_html;
            eventListenersVoorDynamischeElementen();            
       }
    )
}

function cursistBewaren() {
    // INVOER
   let cursist_naam = document.getElementById("input_cursist_naam").value;
   let cursist_voornaam = document.getElementById("input_cursist_voornaam").value;
   let cursist_email = document.getElementById("input_cursist_email").value;
   let cursist_paswoord = document.getElementById("input_cursist_paswoord").value;
   let cursist_telefoon = document.getElementById("input_cursist_telefoon").value;
   let cursist_adres = document.getElementById("input_cursist_adres").value;
   let cursist_postcode = document.getElementById("input_cursist_postcode").value;
   let cursist_stad = document.getElementById("input_cursist_stad").value;
   let cursist_beeld_origineel = document.getElementById("input_cursist_beeld_origineel").value;
   let beeld = document.getElementById("input_cursist_beeld");

    // VERWERJING
    let cursist_beeld;
    if (beeld.files.length == 1) {
        cursist_beeld = beeld.files[0];
    }
    else {
        cursist_beeld = cursist_beeld_origineel;
    }

    let form_cursist = document.getElementById("form_cursist");
    if (form_cursist.checkValidity()) {
        let cursist = {
            "naam": cursist_naam, 
            "voornaam": cursist_voornaam,
            "email": cursist_email,
            "password": cursist_paswoord,
            "telefoon": cursist_telefoon,
            "adres": cursist_adres,
            "postcode": cursist_postcode,
            "stad": cursist_stad,
            "afbeelding":cursist_beeld
        };
        console.log(cursist);
       //console.log(cursist);
        let parameters = {
            "endpoint": tweede_endpoint + "/user/register",
            "project": project,
            "token": token, 
            "entity": "user",
            "values": cursist};
        
        if (huidige_cursist_actie == "update") {
            parameters.filter = ["user_id", "=", huidge_cursist_id];
            dwapiUpdate(parameters).then(
                
                resultaat => {
                    console.log(resultaat);
                    // UITVOER
                    verwerkResultaatNaCursusActie(resultaat, "modal_cursist");                    
                }
            )
        }
        else {
            dwapiCreate(parameters).then(
                resultaat => {
                    // UITVOER
                    verwerkResultaatNaCursusActie(resultaat, "modal_cursist");
                }
            )
        }
    }
    else {
        // UITVOER
        form_cursist.classList.add('was-validated');
    }
}

function cursistVerwijderen(cursist_id) {
    // INVOER
    let parameters = {
        "endpoint": endpoint, 
        "project": project,
        "token": token, 
        "entity": "user",
        "filter": ["user_id", "=", cursist_id]
    }

    // VERWERKING
    dwapiDelete(parameters).then(
        resultaat => {
            verwerkResultaatNaCursusActie(resultaat, "modal_cursist_verwijderen");
        }
    )
}

function cursistenFilteren() {
    // INVOER
    huidige_filter_waardes = [];
    let filter_naam = document.getElementById("input_filter_naam").value;
    let filter_telefoon = document.getElementById("input_filter_telefoon").value;
    let filter_email = document.getElementById("input_filter_email").value;

    // VERWERKING
    if (String(filter_naam) != "") {
        huidige_filter_waardes.push(["naam", "LIKE", "%" + filter_naam + "%"]);
    }
    if (String(filter_telefoon) != "") {
        huidige_filter_waardes.push(["telefoon", "LIKE", "%" + filter_telefoon + "%"]);
    }
    if (String(filter_email) != "") {
        huidige_filter_waardes.push(["email", "LIKE", "%" + filter_email + "%"]);
    }
    
    // UITVOER
    toonCursistenTabel();
}

function cursistenSorteren(link) {
    // INVOER
    let sorteer_op = link.dataset.sorteerOp;

    // VERWERKING    
    let sorteer_richting = "ASC";
    if (huidige_sorteer_waarde[0] == sorteer_op && huidige_sorteer_waarde[1] == "ASC") {
        sorteer_richting = "DESC";
    }
    
    huidige_sorteer_waarde = [sorteer_op, sorteer_richting];
    
    // UITVOER
    toonCursistenTabel();
    toonSorteerRichting();
}

// ------------------ //

function eventListenersVoorStatischeElementen() {
    let cursist_bewaren = document.getElementById("button_cursist_bewaren");
    if(cursist_bewaren){
        cursist_bewaren.addEventListener('click', function() {
            cursistBewaren();
        })
    }
    let cursist_verwijdren = document.getElementById("button_cursist_verwijderen");
    if(cursist_verwijdren){
        cursist_verwijdren.addEventListener('click', function() {
            cursistVerwijderen(huidge_cursist_id);
        })
    }
    let cursist_zoek = document.getElementById("button_cursist_zoek");
    if(cursist_zoek){
        cursist_zoek.addEventListener('click', function() {
            cursistenFilteren();
        })
    }
    /*document.getElementById("button_cursist_bewaren").addEventListener('click', function() {
        cursistBewaren();
    })
    document.getElementById("button_cursist_verwijderen").addEventListener('click', function() {
        cursistVerwijderen(huidge_cursist_id);
    })

    document.getElementById("button_cursist_zoek").addEventListener('click', function() {
        cursistenFilteren();
    })*/

    let sorteer_links;
    sorteer_links = document.querySelectorAll('.link-cursisten-sorteren');
    for (var i = 0; i < sorteer_links.length; i++) {
        sorteer_links[i].addEventListener('click', function() {     
            cursistenSorteren(this);
        })
    }
}

function eventListenersVoorDynamischeElementen() {
    /* "locatie toevoegen" knop (statisch) en "locatie wijzigen" knoppen (dynamisch) */
    let toon_cursist_modal_buttons;
    toon_cursist_modal_buttons = document.querySelectorAll('.button-toon-cursist-modal');
    if (toon_cursist_modal_buttons) {
        for (var i = 0; i < toon_cursist_modal_buttons.length; i++) {
            toon_cursist_modal_buttons[i].addEventListener('click', function() {            
                toonCursistModal(this);
            });            
        }        
    }

    /* "locatie verwijderen" knoppen */
    buttons = document.querySelectorAll('.button-toon-cursist-verwijderen-modal');
    if (buttons) {
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', function() {               
                toonCursusVerwijderenModal(this);
            });            
        }           
    }
}

function gebruikerProfiel(){
       
   /* let gebruiker = JSON.parse(window.sessionStorage.getItem("user")) || [];
    (gebruiker.length > 0) ? profiel_naam = `<h5>${gebruiker[0].voornaam}<span> ${gebruiker[0].naam}</span></h5>` : false;
    
   
    return profiel_naam;
    //return profiel_naam;*/
}


function toonCursistModal(via_button) {

    // INVOER
    huidige_cursist_actie = via_button.dataset.cursistActie;
    huidge_cursist_id = via_button.dataset.cursistId;

    // UITVOER
     resetCursusFormulier();  
    if (huidige_cursist_actie == "update") {
        document.getElementById("modal_cursist_titel").innerHTML = "Cursus wijzigen";
        toonHuidigCursusInFormulier();
    }
    else {
        document.getElementById("modal_cursist_titel").innerHTML = "Nieuw cursist toevoegen";
    }

    // verwijder vorige validatie
    document.getElementById("form_cursist").classList.remove('was-validated');
}

function toonCursusVerwijderenModal(via_button) {
    // VERWERKING
    huidge_cursist_id = via_button.dataset.cursistId;
    
    // UITVOER
    document.getElementById("label_cursist_verwijderen").innerHTML = "Wil u cursist <strong>" + via_button.dataset.cursistNaam + "</strong> echt verwijderen?";
}


function toonHuidigCursusInFormulier() {

    let parameters = {
        "endpoint": endpoint, 
        "project": project,
        "token": token, 
        "entity": "user",
        "filter": ["user_id", "=", huidge_cursist_id]
    }
    
    dwapiRead(parameters).then(
        data => {
            let cursist = data.result.items[0];

            document.getElementById("input_cursist_naam").value = cursist.naam;
            document.getElementById("input_cursist_voornaam").value = cursist.voornaam;
            document.getElementById("input_cursist_email").value = cursist.email;
            document.getElementById("input_cursist_paswoord").value = cursist.password;
            document.getElementById("input_cursist_telefoon").value = cursist.telefoon;
            document.getElementById("input_cursist_adres").value = cursist.adres;
            document.getElementById("input_cursist_postcode").value = cursist.postcode;
            document.getElementById("input_cursist_stad").value = cursist.stad;
           // document.getElementById("input_cursist_naam").value = cursist.naam;
           
          //  console.log(cursist.afbeelding);
            let cursist_beeld_origineel = "";
            if (cursist.afbeelding != "") {
                cursist_beeld_origineel = JSON.stringify(cursist.afbeelding);
            }         
            document.getElementById("input_cursist_beeld_origineel").value = cursist_beeld_origineel;
            //document.getElementById("input_cursist_beeld").value = cursist.afbeelding;
        }); 
}

function resetCursusFormulier() {
    document.getElementById("input_cursist_naam").value = "";
    document.getElementById("input_cursist_voornaam").value = "";
    document.getElementById("input_cursist_email").value = "";
    document.getElementById("input_cursist_paswoord").value = "";
    document.getElementById("input_cursist_telefoon").value = "";
    document.getElementById("input_cursist_adres").value = "";
    document.getElementById("input_cursist_postcode").value = "";
    document.getElementById("input_cursist_stad").value = "";
    document.getElementById("input_cursist_beeld").value = "";
  
    document.getElementById("label_cursist_fout").classList.remove("visible");
    document.getElementById("label_cursist_fout").classList.add("invisible");
}

function toonSorteerRichting() {
    // De arrow-up en arrow-down class van alle sorteer links verwijderen
    let alle_sorteer_links = document.querySelectorAll('.link-cursisten-sorteren');
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
        toonCursistenTabel();
        $("#" + modal_id).modal('hide');
    }
    else {
        label_fout = document.getElementById(modal_id).getElementsByClassName("note-danger")[0];
        label_fout.innerHTML = resultaat.status.message;
        label_fout.classList.remove("invisible");
        label_fout.classList.add("visible");
    }
}