//let huidige_cursus_knop;
//let huidige_cursus_id;
let filter_waardes = [];
let sorteer_waarde = ["cursus_id", "ASC"];
let tabel_hoofd_resultaat = '';

window.addEventListener('load', function() { 
    dezeMaandCursussenFilteren();
    categorienTonenInFilter();
    document.getElementById("button_cursus_zoek").addEventListener('click', cursussenFilteren);
    document.getElementById("button-toon-cursus-detail") ? document.getElementById("button-toon-cursus-detail").addEventListener('click', detailFilteren) : false;
  }, false);


function toonCursussenTabel() {
    let parameters = {
        "endpoint": endpoint, 
        "project": project,
        "token": token, 
        "entity": "cursus",
        "filter": filter_waardes,
        "sort": sorteer_waarde,
        "relation": [{"pri_entity": "cursus", "pri_key": "categorie_id", "sec_entity": "categorie", "sec_key": "categorie_id"}, {"pri_entity": "cursus", "pri_key": "locatie_id", "sec_entity": "locatie", "sec_key": "locatie_id"}],
     }
    
    dwapiRead(parameters).then(
        data => {
            let tabel_cursussen_html =  "";
            let cursussen = data.result;
            if(cursussen.item_count == 0){
                tabel_cursussen_html += `
                <div class="row">
                    <p class="no-cursus alert alert-danger">
                    We hebben geen cursus die deze maand begint. 
                    <a href="all-courses.html">klik hier om door al onze cursussen te bladeren </a>
                    </p>
                </div>`;
            }
           
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
                        prijs = `<p>NU €${cursus.earlybird}</p><p>€${cursus.prijs}</p>`;
                    }
                    else{
                        prijs = `<p>Prijs €${cursus.prijs}</p>`;
                    }
                    tabel_cursussen_html += `
                    <div  class="col-md-6">
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
                    </div>`
                });
         tabel_cursussen_html += "</div>";
         
        if(document.getElementById("toon-deze-maand-cursus")){
        document.getElementById("toon-deze-maand-cursus").innerHTML = tabel_cursussen_html;  
       }
        })
}

function dezeMaandCursussenFilteren() {
    // INVOER
    filter_waardes = [];
    let current = new Date();
    let maand;
   
    // VERWERK
    maand = current.getFullYear() + '-' + 0+(current.getMonth() + 1);
    if (String(maand) != "") {
        filter_waardes.push(["startdatum", "LIKE", "%" + maand + "%"]);
    }    
    // UITVOER
    toonCursussenTabel();
}



function categorienTonenInFilter() {
    //INVOER

        let parameters = {
            "endpoint": endpoint, 
            "project": project,
            "token": token, 
            "entity": "categorie"
        }
        
        dwapiRead(parameters).then(
            data =>{
            let categorie_opties = 
                    `<select class="form-select" aria-label="zoeken">
                    <option selected="">Categorien</option>`;
                        
            // VERWERKING
            data.result.items.forEach(function(categorie) {
                categorie_opties += "<option value=" + categorie.categorie_id + ">" + categorie.naam + "</option>";
            });
            
            categorie_opties +=`</select>`;

            //UITVOER
            console.log(categorie_opties);
            document.getElementById("zoeken_door_categorie").innerHTML = categorie_opties;
        } 
    )
            
}



function cursussenFilteren() {
    // INVOER
    filter_waardes = [];
    let filter_naam = document.getElementById("input_cursus_naam").value;

    // VERWERKING
    if (String(filter_naam) != "") {
        filter_waardes.push(["titel", "LIKE", "%" + filter_naam + "%"]);
    }
    tabel_hoofd_resultaat = `<div class="row">
                        <div class="con-title">
                            <h2>Cursus<span>Zoekresultaat</span></h2>
                        </div>
                    </div>
                    <div class="row">`;  

   
    // UITVOER
    toonZoekResultaatTabel();
}

/*function detailFilteren() {

    // INVOER
    huidige_filter_waardes = [];
    let id = window.location.id;

    // VERWERK
    if (id) {
        huidige_filter_waardes.push(["cursus_id", "=", id]);
    }
    tabel_hoofd = `<div class="row">
                        <div class="con-title">
                            <h2>Cursus<span>Zoekresultaat</span></h2>
                        </div>
                    </div>
                    <div class="row">`;  
 
    // UITVOER
   // toonDetailTabel();
}*/

function toonZoekResultaatTabel() {
    let parameters = {
        "endpoint": endpoint, 
        "project": project,
        "token": token, 
        "entity": "cursus",
        "filter": filter_waardes,
        "sort": sorteer_waarde,
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
               tabel_cursussen_html = tabel_hoofd_resultaat;
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
                        prijs = `<p>NU €${cursus.earlybird}</p><p>€${cursus.prijs}</p>`;
                    }
                    else{
                        prijs = `<p>Prijs €${cursus.prijs}</p>`;
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
                                        <a href="course-details.html?id=${cursus.cursus_id}" type="button" class="button-toon-cursus-detail" id='${cursus.cursus_id}'><i class="fa fa-eye" aria-hidden="true"></i>Lees meer</a> </li>
                                        <li><a href="#"><i class="fa fa-map" aria-hidden="true"></i>${locatie_naam} </a> </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>`
                });
               }
              tabel_cursussen_html += "</div>";
            if(document.getElementById("index-cursus-zoek")){
                document.getElementById("index-cursus-zoek").innerHTML =  tabel_cursussen_html;
            }
        })
}
/*
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
            let cursussen = data.result;
                cursussen.items.forEach(function(cursus) {
               
                    let locatie_naam = "";
                    let categorie_naam = "";
                    let prijs = "";
                    let beeld = "";
                    let adres, postcode, stad = '';
                    if (cursus.afbeelding != null && cursus.afbeelding != "") {
                        beeld = '<img src="https://' +  data.result.assets_path + "/" +  cursus.afbeelding.name + '" />';
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
                        prijs = `<p>NU €${cursus.earlybird}</p><p>€${cursus.prijs}</p>`;
                    }
                    else{
                        prijs = `<p>Prijs €${cursus.prijs}</p>`;
                    }

                    tabel_detail_cursus_html += `
                                <div class="cor-p1">
                                <h2>${cursus.titel} </h2>
                                <span class="home-top-cour-rat">${prijs}</span>
                                <span>Categorie: ${categorie_naam}</span>
                            </div>
                            <div class="cor-p4">
                                <h3>Inhoud</h3>
                                <p>${cursus.omschrijving}</p>     
                                <!--
                                <input class="inschrijven" id="inschrijven" type="submit" value="Aankoop" data-mdb-toggle="modal" data-mdb-target="#verder_bestellen_of_winkelen" onclick="winkel();">
                                -->
                                <a href="#!" class="btn btn-primary" data-toggle="modal" data-target="#verder_bestellen_of_winkelen">Aankoop</a>
                        
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
                                            <li>Prijs is ${prijs}€</li>
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
                            </div>
                            <div class="cor-p4">
                            <h3>Gelijkaardige cursussen</h3>
                            <div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="home-top-cour">
                                            <div class="col-md-3 col-sm-3"> <img src="images/course/java.png" alt=""> </div>
                                            <div class="col-md-9 col-sm-9 home-top-cour-desc">
                                                <a href="course-details.html">
                                                    <h3>Java Ontwikkelaar</h3>
                                                </a>
                                                <h4>IT</h4>
                                                <p>Deze cursus begint op 24/07/2021</p>
                                                <span class="home-top-cour-rat"><p>€100</p></span>
                                                <div class="hom-list-share">
                                                    <ul>
                                                        <li><a href="course-details.html"><i class="fa fa-eye" aria-hidden="true"></i> Lees meer</a> </li>
                                                        <li><a href="course-details.html"><i class="fas fa-book-reader" aria-hidden="true"></i>2 Vrije plaatsen </a> </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="home-top-cour">
                                            <div class="col-md-3 col-sm-3"> <img src="images/course/php.jfif" alt=""> </div>
                                            <div class="col-md-9 col-sm-9 home-top-cour-desc">
                                                <a href="course-details.html">
                                                    <h3>PHP Ontwikkelaar</h3>
                                                </a>
                                                <h4>ICT</h4>
                                                <p>Deze cursus begint op 18/08/2021</p> 
                                                <span class="home-top-cour-rat"><p>NU €50</p><p>€80/</p> </span>
                                                <div class="hom-list-share">
                                                    <ul>
                                                        <li><a href="course-details.html"><i class="fa fa-eye" aria-hidden="true"></i> Lees meer</a> </li>
                                                        <li><a href="course-details.html"><i class="fas fa-book-reader" aria-hidden="true"></i>11 Vrije plaatsen </a> </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`        
                });
               
              tabel_detail_cursus_html;
        })  
        return tabel_detail_cursus_html;
}*/