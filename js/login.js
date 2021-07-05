let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo2LCJleHAiOjE2MjUxMjY3OTAsImlzcyI6IjRucW1sUkFpRTVjRyIsImlhdCI6MTYyNTA5MDc5MH0.CNT_o_QaqvgWfGyM6V4ta6DwB8yj2PVbN5ThJNQq3BE";
let endpoint = "https://dwapi.dev";
let project = "4nqmlRAiE5cG";

window.onload = function(){
    document.getElementById("button_inloggin").addEventListener('click', inLoggen);
}

function inLoggen() {
    // INVOER
    let gebruikeremail= document.getElementById("email").value;
    let wachtwoord = document.getElementById("wachtwoord").value;
    //let onthoud = document.getElementById("onthoud").checked;

    // VERWERJING
    let form_inloggen = document.getElementById("form_inloggen");
    if (form_inloggen.checkValidity()) {
        let parameters = {
            "endpoint": endpoint + "/user/login",
            "project": project,               
            "email": gebruikeremail,
            "password": wachtwoord
        };
            let res = dwapiLogin(parameters)
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
                    window.location.replace("admin.html"); 
                    }
                    else{
                        window.location.replace("index.html"); 
                    }                         
                  }
                 else {
                      //  console.log('invalid');
                        label_fout = document.getElementById(modal_id).getElementsByClassName("note-danger")[0];
                        label_fout.innerHTML = resultaat.status.message;
                        label_fout.classList.remove("invisible");
                        label_fout.classList.add("visible");
                    }
              // }
            //)
        //}
    })}
    else {
        //UITVOER
        form_inloggen.classList.add('was-validated');
    }
}


