window.onload = function(){
    getAllwinkel();
    //winkel();
}


function winkel(){
        //invoeren

        //verwerken
        let product = 2;

        let product_lijst = JSON.parse(window.localStorage.getItem("products")) || [];
        let nieuw_lijst = [...product_lijst];
        let isProduct = nieuw_lijst.indexOf(product);

        if(isProduct >= 0){
            nieuw_lijst.splice(isProduct, 1);
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
    //document.getElementById("badge").innerHTML = producten.length;
    //    console.log(producten.length);
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
