//let filter_waardes = [];
let sorteer = ["cursus_id", "ASC"];
let huidige_cursus_id;      


window.addEventListener('load', function() { 
    cursussenVanSessie();
    getAllCursussen();
    document.getElementById("button_aankoop_bevestig").addEventListener('click', verderBestelling);
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
            //let subtotaal = 0;
           // let btw = 0;
            //let totaal = 0;

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
               //tabel_cursussen_html = tabel_hoofd;
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
               // totaal = subtotaal + btw;
               // bestellingBedrag(subtotaal, btw, totaal);
                 }                 
               // bestelling.push(bedrag);
              // bestelling.totaal += totaal,
              // bestelling.subtotaal += totaal,
              // bestelling.btw += btw
              // bedrag.push(totaal);
            return tabel_cursussen_html;//, totaal;
        })
    }
                  
function bestellingBedrag(subtotaal, btw, totaal){
    console.log(subtotaal, totaal)
    
}
function getAllCursussen() {
    //INVOER
    let product_lijst = cursussenVanSessie();
    
    let cursussen = [];
    let prijs = 0;
    let btw = 0;
    let totaal = 0;

   //VERWERK
   (product_lijst.length == 0) ? document.getElementById("winkelwagantje-lijst").innerHTML = `<p class="bg-danger">Geen items om af te rekenen</p>` : false;
  
    product_lijst.forEach(function(cursus_id){
       cursussen.push(toonWinkelWagantje(cursus_id.id));
       prijs += cursus_id.prijs;
    });
    btw = prijs * 0.15;
    totaal = prijs + btw;

    //UITVOER
    Promise.all(cursussen).then((values) => {
        document.getElementById("winkelwagantje-lijst").innerHTML = values;
    });
    let bedrag = "<p>Subtotaal: €" + prijs + "</p>" +
    "<p>Inclusief BTW: €" + btw + "(15%)" + "</p>" +
    "<h4>Totaal Bedrag: €" + totaal + "</h4>" +
    `<div>
            <a 
            data-product-id='1',
            data-product-naam='zz',
            data-toggle='modal',
            data-target='#bevestigen',
            class="btn btn-warning btn-block button_product_verwijderen">Verder met bestellen</a>
    </div>`;
    document.getElementById("betaal_bedrag").innerHTML = bedrag;  
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
   console.log("index is", cursusIndex);
    //console.log("verwijdered succesfully" + id);
    setTimeout(function(){
        window.location = "winkelwagentje.html";
       }, 1000);
   
}
function verderBestelling(){
   // let gebruiker = JSON.parse(window.sessionStorage.getItem("user")) || [];
   // Window.location.replace("bestelling.html");
    window.location.replace("bestelling.html");
}

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
