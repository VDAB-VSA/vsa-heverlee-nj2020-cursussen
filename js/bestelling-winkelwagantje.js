//let filter_waardes = [];
let sorteer = ["cursus_id", "ASC"];
let huidige_cursus_id;      
         
let bestelling = {
    "totaal":0,
    "subtotaal":0,
    "btw": 0
};
let bedrag = [];
//let tabel_hoofd = '';

window.addEventListener('load', function() { 
cursussenVanSessie();
getAllCursussen();

(document.getElementById("process_bestelling")) ? document.getElementById("process_bestelling").addEventListener('click', () => {bestelToevoegen()}) : false;
document.getElementById("gebruiker_gegeven").addEventListener('click', verderBestelling);
let cursus_verwijdren = document.getElementById("button_product_verwijderen");
(cursus_verwijdren) ? cursus_verwijdren.addEventListener('click', () => {cursusVerwijderen(huidige_cursus_id)}) : false;
 }, false);


function toonWinkelWagantje(id){

    //INVOER
    let filter_waardes = [];
    filter_waardes.push(["cursus_id", "=", id]);

    //VERWERK
    let parameters = {
        "endpoint": endpoint, 
        "project": project,
        "token": token, 
        "entity": "cursus",
        "filter": filter_waardes,
        "sort": sorteer,
        "relation": [{"pri_entity": "cursus", "pri_key": "categorie_id", "sec_entity": "categorie", "sec_key": "categorie_id"}, {"pri_entity": "cursus", "pri_key": "locatie_id", "sec_entity": "locatie", "sec_key": "locatie_id"}],
     }
    
    return dwapiRead(parameters).then(
        data => {
            let tabel_cursussen_html =  "";
            let cursussen = data.result;
            if(cursussen.item_count == 0){
                
                tabel_cursussen_html += `
                <div class="container com-sp pad-bot-70">
                <div class="row">
                    <p class="no-cursus alert alert-danger">
                    <span>🔍</span>
                    Sorry we konden de zoekterm niet vinden. 
                    </p>
                </div>
                <div class="row">
                <p class="no-cursus alert alert-danger">
                <a href="all-courses.html">klik hier om door al onze cursussen te bladeren </a>
                </p>
            </div>
                </div>`;
            }
           else {
                cursussen.items.forEach(function(cursus) {
                    let locatie_naam = "";
                    let categorie_naam = "";
                    let prijs = "";
                    let beeld = "";
                    if (cursus.afbeelding != null && cursus.afbeelding != "") {
                        beeld = '<img src="https://' +  data.result.assets_path + "/" +  cursus.afbeelding.name + '" />';
                    }
                    if (cursus.locatie_id != null) {
                        locatie_naam = cursus.locatie.items[cursus.locatie_id].naam_campus;
                    }
                    if (cursus.categorie_id != null) {
                      categorie_naam = cursus.categorie.items[cursus.categorie_id].naam;
                    }
                    if(cursus.earlybird > 0){
                        prijs = `<h4 class="text-success">Eearly bird €${cursus.earlybird}</h4>`;
                    }
                    else{
                        prijs = `<h4 class="text-warning">€${cursus.prijs}</h4>`;
                    }
                    tabel_cursussen_html += "<div class='winkelwagantje-lijst'>" +
                    "<div class='home-top-cour-desc'>" +
                        beeld +
                    "</div>" +
                    "<div>" +
                        "<a href='course-details.html'>" +
                            "<h3>" + cursus.titel + "</h3>" +
                            "<h4>" + categorie_naam + "</h4>" +
                        "</a>" +
                    "</div>" +
                    "<div class='winkelwagentje_omschrijving home-top-cour-desc'>" +
                        "<p>Begint Op: " + cursus.startdatum + "- TOT" + cursus.einddatum + "</p>" +
                        "<h5>Cursus lesuren:" + cursus.aantal_lesuren + "Uren</h5>" +
                    "</div>" +
                    "<div class='d-flex winklewandje-verwijderen'>" +
                        "<div>" +
                            prijs +
                        "</div>" +
                        "<div class='col-md-1 col-lg-1 col-xl-1 text-end'>" +
                            "<a " +
                                "href='#!'" +
                                "type='button'" +
                                "class=' button-toon-cursus-verwijderen-modal text-danger'" + 
                                "data-cursus-id='" + cursus.cursus_id + "' " +
                                "data-cursus-naam='gg' " +
                                "data-toggle='modal' " +
                                "data-target='#modal_product_verwijderen' onclick='toonCursusVerwijderenModal("+ cursus.cursus_id +")'>" +
                                "<i class='fas fa-trash fa-lg'></i>" +
                            "</a>" +
                        "</div>" +
                    "</div>" +
                "</div>"
                });

                 }                 
            return tabel_cursussen_html;
        })
    }

 function bestelToevoegen() {
     //INVOER
     let gebruiker = JSON.parse(window.sessionStorage.getItem("user"));
     let cursussen = JSON.parse(window.sessionStorage.getItem("cursussen"));
     let gebruiker_id = gebruiker[0].id;
     let prijs = 0;
     
     for(i=0; i<cursussen.length; i++){
         console.log(cursussen[i].prijs);
         prijs += cursussen[i].prijs;
        }

      let btw = prijs * 0.15;
     let totaal = btw + prijs;
    
     let aankoop_id = Math.floor(new Date().valueOf() * Math.random());
     let datum = new Date().toISOString().slice(0, 10);
     let bestelling = {
         aankoop_id,
         gebruiker_id,
         prijs,
         btw,
         totaal,
         datum
     } 
     createBestelling(bestelling);
     
 }   
 function createBestelling(bestelling){
     let values = {
         "aankoop_id": bestelling.aankoop_id,
         "user_id": bestelling.gebruiker_id,
         "subtotaal": bestelling.prijs,
         "btw": bestelling.btw,
         "totaal_bedrag": bestelling.totaal,
         "aankoop_datum": bestelling.datum,
         "betaal_status": "betaald",
         "betaal_datum": bestelling.datum,
         "betaal_methode": "Debit Card"
     }
    let parameters = {
        "endpoint": endpoint, 
        "project": project,
        "token": token, 
        "entity": "aankoop",
        "values": values,
     } 
     dwapiCreate(parameters).then(
        resultaat => {
            // UITVOER
            if(resultaat.status.success == true){
                
                let cursus = cursussenVanSessie();
                cursus.forEach(function(item){
                    cursusToevoeged(bestelling.aankoop_id, item.id);
                })
                console.log("bestelling toevoegd");
            }})
     
 }              
function cursusToevoeged(aankoop_id, id){

    let values = {
         "aankoop_id": aankoop_id,
         "cursus_id": id
     }
    let parameters = {
        "endpoint": endpoint, 
        "project": project,
        "token": token, 
        "entity": "aankoop_cursus",
        "values": values,
     } 
     dwapiCreate(parameters).then(
        resultaat => {
          console.log(resultaat);
        })
}

function getAllCursussen() {

    //INVOER
    let product_lijst = cursussenVanSessie();
    let cursussen = [];
    let prijs = 0;
    let btw = 0;
    let totaal = 0;

   //VERWERK
    if(product_lijst.length > 0){   
        product_lijst.forEach(function(cursus_id){
        cursussen.push(toonWinkelWagantje(cursus_id.id));
        prijs += cursus_id.prijs;
        });

        //UITVOER
        Promise.all(cursussen).then((values) => {
            document.getElementById("winkelwagantje-lijst").innerHTML = values;
            if(document.getElementById("overzicht-bestelling")){
                document.getElementById("overzicht-bestelling").innerHTML = values; 
            }
        });
        
        btw = prijs * 0.15;
        totaal = prijs + btw;
        let bedrag = "<p>Subtotaal: €" + prijs + "</p>" +
        "<p>Inclusief BTW: €" + btw + "(15%)" + "</p>" +
        "<h4>Totaal Bedrag: €" + totaal + "</h4>" +
        `<div class="invisible">
                <a 
                data-product-id='1',
                data-product-naam='zz',
                data-toggle='modal',
                data-target='#bevestigen',
                class="btn btn-warning btn-block button_product_verwijderen">Verder met bestellen</a>
        </div>`;
        document.getElementById("betaal_bedrag").innerHTML = bedrag;  
    }
    else{
  document.getElementById("winkelwagantje-lijst").innerHTML = `<p class="bg-danger">Geen items om af te rekenen</p>`;
  document.getElementById("betaal_bedrag").innerHTML = "";
  }
}

function cursusVerwijderen(id){
    //INVEOER
    let product_lijst = cursussenVanSessie();
    let nieuw_lijst = [];

    //VERWERK
    let lijst = [...product_lijst];
    for(i=0; i< lijst.length; i++){
        if(lijst[i].id != id){
            nieuw_lijst.push(lijst[i]);
        }
    }

   //UITVOER
    window.sessionStorage.setItem("cursussen", JSON.stringify(nieuw_lijst));
    getAllCursussen();   
}
function verderBestelling(){

    //INVOER 
    let gebruiker_id = null;
    let gebruiker_data = [];
    let gebruiker = JSON.parse(window.sessionStorage.getItem("user")) || [];
    //VERWERK
    (gebruiker.length > 0) ? gebruiker_id = gebruiker[0].id : false;
    
    //UITVOER
    toonGebruikerGegevens(gebruiker_id).then(data => {
        document.getElementById("gebruikerData").innerHTML = data;
        if(document.getElementById("overzicht-gebruiker")){
        document.getElementById("overzicht-gebruiker").innerHTML = data;
        }
    });       
}

function toonGebruikerGegevens(id){

    //INVOER
    let filter_waardes = [];
       
    //VERWERK
    filter_waardes.push(["user_id", "=", id]);
    let parameters = {
        "endpoint": endpoint, 
        "project": project,
        "token": token, 
        "entity": "user",
        "filter": filter_waardes
     }
    //UITVOER
    return dwapiRead(parameters).then(
        gebruikers => {
            let gebruiker_gegvens = '';
            gebruikers.result.items.forEach(function(gebruiker) {
                let btwClass = 'invisible';
                (gebruiker.btw_nummer) ? btwClass = "visible" : false;

                gebruiker_gegvens = `<div class="row">
                <div class="input-field col s6">
                    <input type="text" class="validate" id="voornaam" value="${gebruiker.voornaam}" required>
                </div>
                <div class="input-field col s6">
                    <input type="text" class="validate" id="naam" value="${gebruiker.naam}" required>
                </div>
            </div>
            <div class="row">
                <div class="input-field col s6">
                    <input type="number"  id="telefoon" value="${gebruiker.telefoon}" class="validate">
                </div>
                <div class="input-field col s6">
                    <input type="email" id="email" class="validate" value="${gebruiker.email}" required>
                </div>
            </div>
            <div class="row">
                <div class="input-field col s6">
                    <input type="number" id="postcode" class="validate" value="${gebruiker.postcode}">
                </div>
                <div class="input-field col s6">
                    <input type="text" id="woonplaats" class="validate" value="${gebruiker.stad}">
                </div>
            </div>
            <div class="row">
                <div class="input-field col s12">
                    <input type="text" id="adres" class="validate" value="${gebruiker.adres}">
                </div>
            </div>                                                        
            <div id="bedrijf" class=${btwClass}>
                <div class="row col-md-12">
                    <input type="checkbox" name="bedrijf" id="ik_ben_bedrijf" checked>
                    <label for="bedrijf">Bedrijfsgegevens aan deze gebruiker hebben gekoppeld</label>
                </div>
            
                <div class="row">
                    <div class="input-field col s4">
                        <input type="text" id="btw_nummer" value="Bedrijf Naam: ${gebruiker.bedrijf_naam}" class="validate">
                    </div>
                    <div class="input-field col s4">
                        <input type="text" id="bedrijf_naam" value="BTW: ${gebruiker.btw_nummer}" class="validate">
                    </div>
                    <div class="input-field col s4">
                        <input type="text" id="bedrijf_adres" value="${gebruiker.bedrijf_adres} + "," + ${gebruiker.bedrijf_postcode} + " " + ${gebruiker.bedrijf_stad}" class="validate">
                    </div>
                </div>       
            </div>`            
             });
             return gebruiker_gegvens;
        })     
        
    }

    let gebruiker_gegvens = `<div class="row">
    <div class="input-field col s6">
        <input type="text" class="validate" id="voornaam" required>
    </div>
    <div class="input-field col s6">
        <input type="text" class="validate" id="naam" required>
    </div>
</div>
<div class="row">
    <div class="input-field col s6">
        <input type="number"  id="telefoon" class="validate">
    </div>
    <div class="input-field col s6">
        <input type="email" id="email" class="validate" required>
    </div>
</div>
<div class="row">
    <div class="input-field col s6">
        <input type="number" id="postcode" class="validate">
    </div>
    <div class="input-field col s6">
        <input type="text" id="woonplaats" class="validate">
    </div>
</div>
<div class="row">
    <div class="input-field col s12">
        <input type="text" id="adres" class="validate">
    </div>
</div>                                                        
<div id="bedrijf" class="invisible">
    <div class="row col-md-12">
        <input type="checkbox" name="bedrijf" id="ik_ben_bedrijf" checked>
        <label for="bedrijf">Bedrijfsgegevens aan deze gebruiker hebben gekoppeld</label>
    </div>

    <div class="row">
        <div class="input-field col s4">
            <input type="text" id="bedrijf_naam"class="validate">
        </div>
        <div class="input-field col s4">
            <input type="text" id="btw_nummer" class="validate">
        </div>
        <div class="input-field col s4">
            <input type="text" id="bedrijf_adres" class="validate">
        </div>
    </div>       
</div>`;

function cursussenVanSessie() {
    let product_lijst = JSON.parse(window.sessionStorage.getItem("cursussen")) || [];
    if(product_lijst.length <= 0){
        window.location.replace("all-courses.html"); 
    }
    return product_lijst;
}

function toonCursusVerwijderenModal(via_button) {
    huidige_cursus_id = via_button;
}
