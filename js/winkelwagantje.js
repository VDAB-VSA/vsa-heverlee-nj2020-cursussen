let filter_waardes = [];
let sorteer = ["cursus_id", "ASC"];
//let tabel_hoofd = '';

window.addEventListener('load', function() { 
getAllIds();
//cursussenFilteren();
//toonWinkelWagantje();
document.getElementById("button_aankoop_bevestig").addEventListener('click', verderBestelling);
document.getElementById("button_product_verwijderen").addEventListener('click', cursusLijstVerwijderen);
//document.getElementById("button_product_verwijderen").addEventListener('click', function() {
  //  productVerwijderen(huidige_product_id);
//})
 }, false);


function toonWinkelWagantje(id){

    //INVOER
    filter_waardes = [];
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
               tabel_cursussen_html = tabel_hoofd;
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
                    tabel_cursussen_html += `<div class="winkelwagantje-lijst">
                    <div class="home-top-cour-desc">
                        ${beeld}
                    </div>
                    <div class="">
                        <a href="course-details.html">
                            <h3>${cursus.titel}</h3>
                            <h4>${categorie_naam}</h4>
                        </a>
                    </div>
                    <div class="winkelwagentje_omschrijving home-top-cour-desc">
                        <p>Begint Op: ${cursus.startdatum} - TOT ${cursus.einddatum}</p>
                        <h5>Cursus lesuren: ${cursus.aantal_lesuren} Uren</h5>
                    </div>
                    <div class="d-flex winklewandje-verwijderen">
                        <div>
                            ${prijs}
                        </div>
                        <div class="col-md-1 col-lg-1 col-xl-1 text-end" >
                            <a
                                href="#!"
                                type="button"
                                class="text-danger button-toon-product-verwijderen-modal"
                                data-cursus-id='2',
                                data-cursus-naam='gg',
                                data-toggle='modal',
                                data-target='#modal_product_verwijderen'>
                                <i class="fas fa-trash fa-lg"></i>
                            </a>
                        </div>
                    </div>
                </div>
                    `
                });
               }
              return tabel_cursussen_html;
        })
    }
                  

function getAllIds() {
    //INVOER
    let product_lijst = JSON.parse(window.sessionStorage.getItem("cursussen")) || [];
    let cursussen = [];
    let bedrag_tebetal = '<p class="bg-danger">Geen items om af te rekenen</p>';

   //VERWERK
    (product_lijst.length == 0) ? (document.getElementById("winkelwagantje-lijst").innerHTML = `<p class="bg-danger">Geen items om af te rekenen</p>`) :
    product_lijst.forEach(function(cursus_id){
       cursussen.push(toonWinkelWagantje(cursus_id));
    });

 //UITVOER
  Promise.all(cursussen).then((values) => {
    document.getElementById("winkelwagantje-lijst").innerHTML = values;
  });
  eventListenersVoorDynamischeElementenLijst(); 
}


function eventListenersVoorDynamischeElementenLijst(){

    buttons = document.querySelectorAll('.button-toon-product-verwijderen-modal');
    if (buttons) {
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', function() {                
                toonCursusVerwijderenModal(this);
            });            
        }           
    }
}

function toonCursusVerwijderenModal(id) {
    console.log(id);
    
}
function verderBestelling(){
    let gebruiker = JSON.parse(window.sessionStorage.getItem("user")) || [];
   // Window.location.replace("bestelling.html");
    window.location.replace("bestelling.html");
}
