/* let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo2LCJleHAiOjE2MjUxMjY3OTAsImlzcyI6IjRucW1sUkFpRTVjRyIsImlhdCI6MTYyNTA5MDc5MH0.CNT_o_QaqvgWfGyM6V4ta6DwB8yj2PVbN5ThJNQq3BE";
let endpoint = "https://dwapi.dev";
let project = "4nqmlRAiE5cG";
 */
/*window.onload = function(){
   eventListenersVoorStatischeElementen();
   console.log('inloggen1');
};

function eventListenersVoorStatischeElementen() {
    console.log('inloggen2');*/

window.addEventListener('load', (event) => {
    console.log("onload");
    document.getElementById("bezoeker_inloggen").addEventListener('click', function() {
        inLoggen();
     })
    console.log('inloggen1');
  });

/*function eventListenersVoorStatischeElementen() {
    console.log("eventListenersVoorStatischeElementen");
    
  
    
}*/


function inLoggen() {
    console.log('inloggen3');
    // INVOER
    let gebruikeremail= document.getElementById("email").value;
    let wachtwoord = document.getElementById("wachtwoord").value;
    //let onthoud = document.getElementById("onthoud").checked;

    // VERWERJING
    let form_inloggen = document.getElementById("form_bezoeker_inloggen");
    if (form_inloggen.checkValidity()) {
        let parameters = {
            "endpoint": tweede_endpoint + "/user/login",
            "project": project,               
            "email": gebruikeremail,
            "password": wachtwoord
        };
            let res = dwapiLogin(parameters)
            .then(
               resultaat => {
                    // UITVOER
                   console.log(resultaat);
                 if (resultaat.status.success == true) { 
                  let gebruiker = resultaat.result.item;
                  let gebruiker_info = {
                        id: gebruiker.user_id,
                        naam:gebruiker.Naam,
                        voornaam:gebruiker.Voornaam,
                        email: gebruiker.email,
                        token: resultaat.result.token      
                      };

                    let gebruiker_session = JSON.parse(window.sessionStorage.getItem("user")) || [];
                    let nieuw_lijst = [...gebruiker_session];
                    nieuw_lijst.push(gebruiker_info);
                    window.sessionStorage.setItem("user", JSON.stringify(nieuw_lijst));
                    if(gebruiker.rol == 'Cursist'){
                        label_succes = document.getElementById("inloggen_succes_boodschap");
                        label_succes.innerHTML = `<div class="alert alert-success" role="alert" data-mdb-color="success">
                        <i class="fas fa-check-circle me-3"></i>Je logged succes in!
                        </div>`;
                        label_succes.classList.remove("invisible");
                        label_succes.classList.add("visible");

                        setTimeout(function(){
                            window.location = "index.html";
                           }, 3000);

                        //window.location.replace("index.html"); 
                    }                         
                  }
                 else {

                        label_fout = document.getElementById("inloggen_fout_boodschap");

                        let message = boodschap[resultaat.status.error_code];
                        label_fout.innerHTML = message;
                        label_fout.classList.remove("invisible");
                        label_fout.classList.add("visible");
                    }
              // }
            //)
        //}
    })
}
    else {
        //UITVOER
        label_fout = document.getElementById("inloggen_fout_boodschap");

        let message = boodschap[resultaat.status.error_code];
        label_fout.innerHTML = message;
        label_fout.classList.remove("invisible");
        label_fout.classList.add("visible");
        form_inloggen.classList.add('was-validated');
    }
}