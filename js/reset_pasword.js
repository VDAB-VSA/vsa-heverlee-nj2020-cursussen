/* let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo2LCJleHAiOjE2MjU2NzU1NzEsImlzcyI6IjRucW1sUkFpRTVjRyIsImlhdCI6MTYyNTYzOTU3MX0.55I8x7U4XHDULfgDwBOlm4eGvQLhV0WeptRW3IUD7nk";
let endpoint = "https://dwapi.dev";
let project = "4nqmlRAiE5cG"; */

/*window.onload = function(){
   eventListenersVoorStatischeElementen();
};

function eventListenersVoorStatischeElementen() {

    document.getElementById("reset_paswoord_button").addEventListener('click', function() {
        nieuwePaswoord();
    })
}*/
window.addEventListener('load', (event) => {
    console.log("onload");
    document.getElementById("reset_paswoord_button").addEventListener('click', function() {
        nieuwePaswoord();
     })
    console.log('pass');
  });

/*function eventListenersVoorStatischeElementen() {
    console.log("eventListenersVoorStatischeElementen");
  
    
}*/


function nieuwePaswoord() {
    console.log('ireset');
    // INVOER
    let gebruikeremail= document.getElementById("email_voor_reset").value;

    // VERWERKING
    let form_reset = document.getElementById("form_reset_paswoord");
    if (form_reset.checkValidity()) {
        let parameters = {
            "endpoint": tweede_endpoint + "/user/reset_password",
            "project": project,               
            "email": gebruikeremail
        };
            dwapiResetPassword(parameters)
            .then(
               resultaat => {
                    // UITVOER
                   console.log(resultaat);
                 if (resultaat.status.success == true) { 
                    label_succes = document.getElementById("reset_succes");
                    label_succes.classList.remove("invisible");
                    label_succes.classList.add("visible");
                    //label_succes.innerHML = "password sent";
                  //let email_database = resultaat.parameters.email;
                  /*let gebruiker_info = {
                        email: email_database,
                        token: resultaat.result.temp_token      
                      };

                    //let gebruiker_session = JSON.parse(window.sessionStorage.getItem("user")) || [];
                    //let nieuw_lijst = [...gebruiker_session];
                    //nieuw_lijst.push(gebruiker_info);
                    //window.sessionStorage.setItem("user", JSON.stringify(nieuw_lijst));
                    if(resultaat/status == true){
                        label_succes = document.getElementById("reset_succes");
                        label_succes.classList.remove("invisible");
                        label_succes.classList.add("visible");

                        //window.location.replace("index.html"); 
                    }   */                      
                  }
                 else {

                        label_fout = document.getElementById("reset_fout");
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
        form_reset.classList.add('was-validated');
    }
}