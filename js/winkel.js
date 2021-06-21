window.onload = function(){
    getAllwinkel();
}

function winkel(){
        //invoeren

        //verwerken
        let product = 1;

        let product_lijst = JSON.parse(window.localStorage.getItem("products")) || [];
        let nieuw_lijst = [...product_lijst];
        let pp = nieuw_lijst.indexOf(product);
        console.log(pp);
        if(pp >= 0){
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