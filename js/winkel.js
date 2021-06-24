const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjQsImV4cCI6MTYyMTcyNDEzMCwiaXNzIjoiTGx1RzNnd1pLUHpDIiwiaWF0IjoxNjIxNjg4MTMwfQ.CZUa2nwdwFepcvUuV7mADgmZEvoDDIct8TI52IoGcfI";
const endpoint = "https://dwapi.dev/item";
const project = "4nqmlRAiE5cG";

let huidige_product_actie;
let huidige_product_id;
let huidige_filter_waardes = [];
let huidige_sorteer_waarde = ["naam", "ASC"];


window.onload = function(){
    getAllwinkel();
    getCourses();
}
/*async function getCourses(){

  let parameters = {
    "endpoint": endpoint, 
    "project": project,
    "token": token, 
    "entity": "cursus",
    "filter": huidige_filter_waardes,
    "sort": huidige_sorteer_waarde,
    "relation": [{"pri_entity": "cursus", "pri_key": "cursus_id", "sec_entity": "categorie", "sec_key": "categorie_id"}]
}
let url = parameters.endpoint + 
"?project=" + parameters.project + 
"&entity=" + parameters.entity;

let response = await fetch(url, {
  method: 'GET'
});
console.log(response);
return response.json()
.then(data => { 
  console.log(data);            
    return data; 
});
}
// READ
async function dwapiRead(parameters) {   
  let url = parameters.endpoint + 
      "?project=" + parameters.project + 
      "&entity=" + parameters.entity;

  if (typeof parameters.filter !== "undefined" && parameters.filter.length > 0) {
      url = url + "&filter=" + encodeURIComponent(JSON.stringify(parameters.filter))
  }
  if (typeof parameters.sort !== "undefined" && parameters.sort.length > 0) {
      url = url + "&sort=" + encodeURIComponent(JSON.stringify(parameters.sort))
  }
  if (typeof parameters.relation !== "undefined" && parameters.relation.length > 0) {
      url = url + "&relation=" + encodeURIComponent(JSON.stringify(parameters.relation))
  }

  let response = await fetch(url, {
      method: 'GET'
  });

  return response.json()
      .then(data => { 
        console.log(data);            
          return data; 
      });
}   */


function winkel(){
        //invoeren

        //verwerken
        let product = 1;

        let product_lijst = JSON.parse(window.localStorage.getItem("products")) || [];
        let nieuw_lijst = [...product_lijst];
        let isProduct = nieuw_lijst.indexOf(product);

        if(isProduct >= 0){
            nieuw_lijst.splice(pp, 1);
        }
        else {
        nieuw_lijst.push(product);
    }
        window.localStorage.setItem("products", JSON.stringify(nieuw_lijst));
}
function getAllwinkel(){
        //invoeren
    let gebruikers_lijst = document.getElementById("ol");
    
    let product_lijst = window.localStorage.getItem("products")
    console.log(product_lijst);
    let producten = JSON.parse(product_lijst);
    console.log(producten);
    //gebruikers = JSON.parse(window.localStorage.getItem("users"));
    
    


    //verwerken
    /*producten.map((product)=>{
      let gebruiker_info = document.createElement("li");
      gebruiker_info.className = "list-group-item d-flex justify-content-between align-items-start";
      gebruiker_info.innerHTML= `
      <div class="ms-2 me-auto">
        <div class="fw-bold">${gebruiker.naam}</div>
        ${gebruiker.email}
      </div>
      <span class="badge bg-primary rounded-pill">${gebruiker.leeftijd}</span>`;

      gebruikers_lijst.appendChild(gebruiker_info);
    })*/
}

 document.getElementById("button_aankoop_bevestig").addEventListener('click', function() {
  window.location.replace("bestelling.html");
// similar behavior as clicking on a link
//window.location.href = "http://stackoverflow.com";
})

document.getElementById("button_product_verwijderen").addEventListener('click', function() {
 let cc= document.getElementById("button_product_verwijderen");
 console.log(cc.dataset);
 // winkel(huidige_product_id);
})
