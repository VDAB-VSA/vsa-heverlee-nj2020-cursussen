let huidige_cursus_actie;
let huidige_cursus_id;
let huidige_filter_waardes = [];
let huidige_sorteer_waarde = ["cursus_id", "ASC"];
let tabel_hoofd = '';

window.addEventListener('load', function() { 
    detailFilteren();
    document.getElementById("button_cursus_zoek").addEventListener('click', cursussenFilteren);
    document.getElementById("button-toon-cursus-detail") ? document.getElementById("button-toon-cursus-detail").addEventListener('click', detailFilteren) : false;
  }, false);

function detailFilteren() {
    // INVOER
    huidige_filter_waardes = [];
    let url = window.location.href;
    let id = url.substring(url.lastIndexOf("=")+1);
    // VERWERK
    if (id) {
        huidige_filter_waardes.push(["cursus_id", "=", id]);
    }
    //UITVOER
    toonDetailTabel();
}

function gelijkaardigeCursus(categorie, id){
    // INVOER
    huidige_filter_waardes = [];
    //VERWERKING
    huidige_filter_waardes = [["categorie_id", "=", categorie], ["cursus_id", "<>", id] ];
    //UITVOER 
   toonGelijkaardigeCursusTabel(); 
}

function cursussenFilteren() {
    // INVOER
    huidige_filter_waardes = [];
    let filter_naam = document.getElementById("input_cursus_naam").value;

    // VERWERK
    if (String(filter_naam) != "") {
        huidige_filter_waardes.push(["titel", "LIKE", "%" + filter_naam + "%"]);
    }
    tabel_hoofd = `<div class="row">
                        <div class="con-title">
                            <h2>Cursus<span>Zoekresultaat</span></h2>
                        </div>
                    </div>
                    <div class="row">`;  

    // UITVOER
    toonZoekResultaatTabel();
}


function toonZoekResultaatTabel() {
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
            let tabel_cursussen_html =  "";
            let cursussen = data.result;
            if(cursussen.item_count == 0){
                
                tabel_cursussen_html += `
                <div class="container com-sp pad-bot-70">
                <div class="row">
                    <p class="no-cursus alert alert-danger">
                    <span>????</span>
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
                        prijs = `<p>NU ???${cursus.earlybird}</p><p>???${cursus.prijs}</p>`;
                    }
                    else{
                        prijs = `<p>Prijs ???${cursus.prijs}</p>`;
                    }
                    tabel_cursussen_html += `
                    <div  class="col-md-6">
                        <div class="home-top-cour">
                            <div class="col-md-3 col-sm-3">
                                ${beeld}
                            </div>
                            <div class="col-md-9 col-sm-9 home-top-cour-desc">
                                <a href="course-details.html?id=${cursus.cursus_id}" id='${cursus.cursus_id}' class="button-toon-cursus-detail" >
                                    <h3>${cursus.titel}<h3>
                                </a>
                                <h4>${categorie_naam}</h4>
                                <p>Deze cursus begint op ${cursus.startdatum}</p> 
                                <span class="home-top-cour-rat">${prijs}</span>
                                <div class="hom-list-share">
                                    <ul>
                                        <li>
                                        <a href="course-details.html?id=${cursus.cursus_id}" type="button" class="button-toon-cursus-detail" id='${cursus.cursus_id}'><i class="fa fa-eye" aria-hidden="true"></i> Lees meer</a> </li>
                                        <li><a href="#"><i class="fa fa-map" aria-hidden="true"></i>${locatie_naam} </a> </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>`
                });
               }
              tabel_cursussen_html += "</div>";         
                document.getElementById("cursus-zoek-rusaltaat").innerHTML =  tabel_cursussen_html;
        })
}

//Toon cursus detail tabel
function toonDetailTabel(){
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
            let tabel_detail_cursus_html =  "";
            let cursus_prijs = 0;
            let beeld = `<img src="images/logo3.png" alt="cursus" />`;
            let inverkoop = `<span class="inverkoop" class="alert alert-danger">momenteel geen les voor deze cursus</span>`;
            let cursussen = data.result;
                cursussen.items.forEach(function(cursus) {
                   
                    let locatie_naam = "";
                    let categorie_naam = "";
                    let prijs = `<p>Cursus Prijs is: ???${cursus.prijs}</p>`;
                    let adres, postcode, stad = '';
                    (cursus.earlybird) ? (cursus_prijs = cursus.earlybird) : (cursus_prijs = cursus.prijs)
                    if (cursus.afbeelding != null && cursus.afbeelding != "") {
                        beeld = '<img src="https://' +  data.result.assets_path + "/" +  cursus.afbeelding.name + '" />';
                    }
                    if(cursus.in_verkoop == 1){
                      inverkoop = `<span class="inverkoop">In Verkoop ????</span>`;
                    }
                    if (cursus.locatie_id != null) {
                        locatie_naam = cursus.locatie.items[cursus.locatie_id].naam_campus;
                        adres = cursus.locatie.items[cursus.locatie_id].adres;
                        postcode = cursus.locatie.items[cursus.locatie_id].postcode;
                        stad = cursus.locatie.items[cursus.locatie_id].stad;
                        
                    }
                    if (cursus.categorie_id != null) {
                      categorie_naam = cursus.categorie.items[cursus.categorie_id].naam;
                    }
                    if(cursus.earlybird > 0){
                        prijs = `<p>NU ???${cursus.earlybird}</p><p>???${cursus.prijs}</p>`;
                    }
                    else{
                        prijs = `<p>Cursus Prijs is: ???22${cursus.prijs}</p>`;
                    }
                    
                    tabel_detail_cursus_html += `
                                <div class="cor-p1">
                                <h2>${cursus.titel} </h2>
                                <span class="home-top-cour-rat">${prijs}</span>
                                <span>Categorie: ${categorie_naam}</span>
                            </div>
                            <div class="cor-p4">
                            <div class="card">
                            <h3>Inhoud</h3>
                            <div class="card-body">
                            <p>${cursus.omschrijving}</p>  
                            </div></div>
                                                                  
                                <!--
                                <input class="inschrijven" id="inschrijven" type="submit" value="Aankoop" data-mdb-toggle="modal" data-mdb-target="#verder_bestellen_of_winkelen" onclick="winkel();">
                                -->
                                <div class="card">
                                <div class="card-body">
                                  <button type="button" class="btn btn-success btn-block btn-lg" data-toggle="modal" data-target="#verder_bestellen_of_winkelen" onclick="aankoop(${cursus.cursus_id}, ${cursus_prijs});"><i class="fas fa-shopping-cart"></i>Aankoop</button>
                                </div>
                              </div>
                                
                            </div>
                            <div class="cor-p5">
                                <h3>Cursus details</h3>
                                <ul class="nav nav-tabs">
                                    <li class="active"><a data-toggle="tab" href="#home">
									<img src="images/icon/cor4.png" alt=""> <span>Informatie</span></a></li>
                                    <li><a data-toggle="tab" href="#menu1"><img src="images/icon/cor3.png" alt=""><span>Prijs</span></a></li>
                                    <li><a data-toggle="tab" href="#menu2"><img src="images/icon/cor1.png" alt=""><span>Locatie</span></a></li>
                                </ul>

                                <div class="tab-content">
                                    <div id="home" class="tab-pane fade in active">
                                        <h4>Over de cursus</h4>
                                        <ul>
                                            <li>In verkoop tot 10/07/2021</li>
                                            <li>Maximum aantal plaatsen: ${cursus.max_aantal_plaatsen} lerlingen</li>
                                            <li>Docent : ${cursus.docent}.</li>
                                            <li>Stardatum: ${cursus.startdatum}</li>
                                            <li>Einddtum: ${cursus.einddatum}</li>
                                            <li>Aantal lesuren: ${cursus.aantal_lesuren} Uren</li>
                                        </ul>
                                    </div>
                                    <div id="menu1" class="tab-pane fade">
                                        <h4>Prijs</h4>
                                        <ul>
                                            <li><b>${prijs}</b></li>
                                        </ul>
                                    </div>
                                    <div id="menu2" class="tab-pane fade">
                                        <h4>Campus</h4>
                                        <p>De les zal fysiek zijn met corena-regels</p>
                                        <ul>
                                        <li>${locatie_naam}</li>    
                                        <li>Adres: ${adres} </li>
                                            <li>${postcode}, ${stad} Leuven</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>`;
                      //  console.log(cursus.categorie_id);
                      gelijkaardigeCursus(cursus.categorie_id, cursus.cursus_id);
                });
               
              //if(document.getElementById("cursus-detail")){
               document.getElementById('cursus_beeld').innerHTML = beeld + inverkoop;
              document.getElementById("cursus-detail").innerHTML =  tabel_detail_cursus_html;  
             //}
        })
    }

function aankoop(id, prijs) {
    //INVOER
    let producten = JSON.parse(window.sessionStorage.getItem("cursussen")) || [];

    //VERWERK
    let nieuw_lijst = [...producten];
    let cursus = {
        "id": id,
        "prijs": prijs
    }
    let isProduct = nieuw_lijst.indexOf(id);
    (isProduct >= 0) ? nieuw_lijst.splice(isProduct, 1) : nieuw_lijst.push(cursus);

    //UITVOER
    console.log(cursus);
    window.sessionStorage.setItem("cursussen", JSON.stringify(nieuw_lijst));
}

function toonGelijkaardigeCursusTabel(){
    //INVOER
    let parameters = {
        "endpoint": endpoint, 
        "project": project,
        "token": token, 
        "entity": "cursus",
        "filter": huidige_filter_waardes,
        "sort": huidige_sorteer_waarde,
        "relation": [{"pri_entity": "cursus", "pri_key": "categorie_id", "sec_entity": "categorie", "sec_key": "categorie_id"}, {"pri_entity": "cursus", "pri_key": "locatie_id", "sec_entity": "locatie", "sec_key": "locatie_id"}],
     }

     //VERWERK
    dwapiRead(parameters).then(
        data => {
            let gelijkaardige_cursussen =  `<div class="cor-p4">
            <h3>Gelijkaardige cursussen</h3>
            <div>`;

            let cursussen = data.result;
            if(cursussen.item_count == 0){
               gelijkaardige_cursussen += `
                <div class="com-sp pad-bot-70">
                    <div class="row">
                        <p class="no-cursus alert alert-danger">
                          Geen gelijkaardige cursus vinden. 
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
                        prijs = `<p>NU ???${cursus.earlybird}</p><p>???${cursus.prijs}</p>`;
                    }
                    else{
                        prijs = `<p>Prijs ???${cursus.prijs}</p>`;
                    }
                    gelijkaardige_cursussen += `
                        <div class="row">
                            <div  class="col-md-12">
                                <div class="home-top-cour">
                                    <div class="col-md-3 col-sm-3">
                                        ${beeld}
                                    </div>
                                    <div class="col-md-9 col-sm-9 home-top-cour-desc">
                                        <a href='course-details.html?id=${cursus.cursus_id}' id='${cursus.cursus_id}' class="button-toon-cursus-detail" >
                                            <h3>${cursus.titel}<h3>
                                        </a>
                                        <h4>${categorie_naam}</h4>
                                        <p>Deze cursus begint op ${cursus.startdatum}</p> 
                                        <span class="home-top-cour-rat">${prijs}</span>
                                        <div class="hom-list-share">
                                            <ul>
                                                <li>
                                                <a href="course-details.html?id=${cursus.cursus_id}" type="button" class="button-toon-cursus-detail" id='${cursus.cursus_id}'><i class="fa fa-eye" aria-hidden="true"></i> lLees meer</a> </li>
                                                <li><a href="#"><i class="fa fa-map" aria-hidden="true"></i>${locatie_naam} </a> </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                         </div>`
                });
            }
              gelijkaardige_cursussen += "</div></div>";
        
              //UITVOER
            document.getElementById("cursus-gerelateerd").innerHTML =  gelijkaardige_cursussen;  
            }
        )
}