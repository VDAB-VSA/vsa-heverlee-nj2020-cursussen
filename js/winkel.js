/* let huidige_cursus_actie;
let huidige_cursus_id;
let huidige_filter_waardes = [];
let huidige_sorteer_waarde = ["cursus_id", "ASC"]; */

window.addEventListener('load', function() { 
 getAllwinkel();
 //winkelLijst();

 // dezeMaandCursussenFilteren();
  //document.getElementById("button_product_verwijderen") ? document.getElementById("button_product_verwijderen").addEventListener('click', itemVerwijderen) : false;
}, false);

function winkel(){
        //INVOER
        let product_lijst = JSON.parse(window.sessionStorage.getItem("cursussen")) || [];

        //VERWERK
        let nieuw_lijst = [...product_lijst];
        let isProduct = nieuw_lijst.indexOf(product);
        if(isProduct >= 0){
            nieuw_lijst.splice(isProduct, 1);
        }
        else {
        nieuw_lijst.push(product);
       }
       //UITVOER
        window.sessionStorage.setItem("cursussen", JSON.stringify(nieuw_lijst));
}

function getAllwinkel(){
    //INVOER
    let aantal_cursussen = document.getElementById("cart-badge");  

    let cursussen = JSON.parse(window.sessionStorage.getItem("cursussen"));
    aantal_cursussen.innerHTML = cursussen.length;
}

function winkelLijst() {

  let product_lijst = JSON.parse(window.sessionStorage.getItem("cursussen")) || [];
        //VERWERK
        let lijst = [...product_lijst];
        //huidige_filter_waardes = [];
       // let isProduct = nieuw_lijst.indexOf(product);
       //huidige_filter_waardes.push(["startdatum", "LIKE", "%" + maand + "%"]);
        if(lijst.length > 0){
          //huidige_filter_waardes.push(["cursus_id", "=", lijst[]]);
            //nieuw_lijst.splice(isProduct, 1);
        }
        else {
        nieuw_lijst.push(product);
       }
       //UITVOER
        window.sessionStorage.setItem("cursussen", JSON.stringify(nieuw_lijst));
  
}
function itemVerwijderen(){


}
 /*document.getElementById("button_aankoop_bevestig").addEventListener('click', function() {
  window.location.replace("bestelling.html");
// similar behavior as clicking on a link
//window.location.href = "http://stackoverflow.com";
})

document.getElementById("button_product_verwijderen").addEventListener('click', function() {
 let cc= document.getElementById("button_product_verwijderen");
 console.log(cc.dataset);
 // winkel(huidige_product_id);
})*/
