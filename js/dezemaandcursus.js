const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo2LCJleHAiOjE2MjQ5ODg2MjQsImlzcyI6IjRucW1sUkFpRTVjRyIsImlhdCI6MTYyNDk1MjYyNH0.LfLNZxFzMbipADXygMXoNMQo5yiXlLtuxekPTsFiY7Q";
const endpoint = "https://dwapi.dev/item";
const project = "4nqmlRAiE5cG";

let huidige_cursus_actie;
let huidige_cursus_id;
let huidige_filter_waardes = [];
let huidige_sorteer_waarde = ["cursus_id", "ASC"];

window.onload = function(){
   toonCursusDezeMaand();
   document.getElementById("button_cursus_bewaren").addEventListener('click', function() {
    zoekCursus();
});
}

function toonCursussenTabel() {
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
            //console.log(data.result.assets_path);
            //console.log(data.result.item_count);
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
                                <a id='${cursus.cursus_id}' class="button-toon-cursus-modal" >
                                    <h3>${cursus.titel}<h3>
                                </a>
                                <h4>${categorie_naam}</h4>
                                <p>Deze cursus begint op ${cursus.startdatum}</p> 
                                <span class="home-top-cour-rat">${prijs}</span>
                                <div class="hom-list-share">
                                    <ul>
                                        <li>
                                        <a href="course-details.html" type="button" class="button-toon-cursus-modal" id='${cursus.cursus_id}'><i class="fa fa-eye" aria-hidden="true"></i> Lees meer</a> </li>
                                        <li><a href="#"><i class="fa fa-map" aria-hidden="true"></i>${locatie_naam} </a> </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>`
                });
           // tabel_cursussen_html += "</table>";
            //document.getElementById("tabel_cursussen").innerHTML = tabel_cursussen_html;
          if(document.getElementById("toon-cursus")){
            document.getElementById("toon-cursus").innerHTML =  tabel_cursussen_html;
        }
        //console.log(tabel_cursussen_html)
        if(document.getElementById("toon-deze-maand-cursus")){
        document.getElementById("toon-deze-maand-cursus").innerHTML = tabel_cursussen_html;  
       }
        })
}
function toonCursusDezeMaand() {
    // INVOER
    huidige_filter_waardes = [];
    
    let current = new Date();
    let filterMaand = current.getFullYear() + '-' + 0+(current.getMonth() + 1);
   
    // VERWERKING
    if (String(filterMaand) != "") {
        huidige_filter_waardes.push(["startdatum", "LIKE", "%" + filterMaand + "%"]);
    }    
    // UITVOER
    toonCursussenTabel();
}

function zoekCursus(){
    
}