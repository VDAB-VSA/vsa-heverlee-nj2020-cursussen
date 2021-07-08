let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo2LCJleHAiOjE2MjUxMjY3OTAsImlzcyI6IjRucW1sUkFpRTVjRyIsImlhdCI6MTYyNTA5MDc5MH0.CNT_o_QaqvgWfGyM6V4ta6DwB8yj2PVbN5ThJNQq3BE";
let endpoint = "https://dwapi.dev";
let project = "4nqmlRAiE5cG";

window.onload = function(){
    loadLogins();
    document.getElementById("button_inloggin").addEventListener('click', inLoggen);
}
function loadLogins(){
    //INVOER
    let loginGegevens = JSON.parse(window.localStorage.getItem("login")) || [];

    //VERWERKING
    if(loginGegevens.length !== 0){
      document.getElementById("email").value = loginGegevens[0].email;
      document.getElementById("wachtwoord").value = loginGegevens[0].wachtwoord;
    }    
}

function inLoggen() {
    // INVOER
    let gebruikeremail= document.getElementById("email").value;
    let wachtwoord = document.getElementById("wachtwoord").value;
    let onthoud = document.getElementById("onthoud").checked;

    // VERWERJING
    if(onthoud){
        let gebruiker = {
            email: gebruikeremail,
            wachtwoord
        }
        let loginGegevens = JSON.parse(window.localStorage.getItem("login")) || [];
                    let loginInfo = [...loginGegevens];
                    loginInfo.push(gebruiker);
                    window.localStorage.setItem("login", JSON.stringify(loginInfo));
    
           }
 

    let form_inloggen = document.getElementById("form_inloggen");
    if (form_inloggen.checkValidity()) {
        let parameters = {
            "endpoint": endpoint + "/user/login",
            "project": project,               
            "email": gebruikeremail,
            "password": wachtwoord
        };
           dwapiLogin(parameters)
            .then(
               resultaat => {
                    // UITVOER
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
                    if(gebruiker.rol == 'Admin'){
                        label_success = document.getElementById("label_inloggen_success");
                        label_success.innerHTML = "Succesvol ingelogd... ";
                        label_success.classList.remove("invisible");
                        label_success.classList.add("visible"); 

                        setTimeout(function(){
                         window.location = "admin.html";
                        }, 3000);
                      }
                      else {
                       window.location.replace("index.html");
                    } 
                    }                        
                  
                 else {
                        let fout_boodshap ="";
                        (resultaat.status.error_code == 9008) ? fout_boodshap = 'Actieve gebruiker met dit e-mailadres/wachtwoord niet gevonden.' : fout_boodshap = resultaat.status.message;                  
                        label_fout = document.getElementById("label_inloggen_fout");
                        label_fout.innerHTML = fout_boodshap;
                        label_fout.classList.remove("invisible");
                        label_fout.classList.add("visible");
                    }
    })}
    else {
        //UITVOER
        form_inloggen.classList.add('was-validated');
    }
}


