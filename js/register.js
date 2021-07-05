let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo2LCJleHAiOjE2MjUxMjY3OTAsImlzcyI6IjRucW1sUkFpRTVjRyIsImlhdCI6MTYyNTA5MDc5MH0.CNT_o_QaqvgWfGyM6V4ta6DwB8yj2PVbN5ThJNQq3BE";
let endpoint = "https://dwapi.dev";
let project = "4nqmlRAiE5cG";

window.onload = function(){
    document.getElementById("button_inloggin").addEventListener('click', inLoggen);
}

function inLoggen() {

    // INVOER
    let gebruikeremail= document.getElementById("gebruikernaam").value;
    let wachtwoord = document.getElementById("wachtwoord").value;
    //let onthoud = document.getElementById("onthoud").checked;

    // VERWERJING
    //let form_inloggen = document.getElementById("form_inloggen");
    //if (form_inloggen.checkValidity()) {
        let gebruiker = {
           "email": gebruikernaam, 
          "password": wachtwoord, 
        };
        let parameters = {
            "endpoint": endpoint + "/user/login",
            "project": project,   
            "values": gebruiker,             
            "email": gebruikeremail,
            "password": wachtwoord
        };
 
        /*let parameters = {
            "endpoint": endpoint, 
            "project": project,
            "token": token, 
            "entity": "user",
            "values": gebruiker};
*/
       /* if (huidige_categorie_actie == "update") {
            parameters.filter = ["categorie_id", "=", huidige_categorie_id];
            dwapiUpdate(parameters).then(
                resultaat => {
                    // UITVOER
                    verwerkResultaatNaCategorieActie(resultaat, "modal_categorie");                    
                }
            )
        }*/
       // else {
        //let login_request = dwapiLogin(parameters);
        //login_request.then(data => {
          //  console.log(data);
        //});
            let res = dwapiLogin(parameters);
            //.then(
               // resultaat => {
                  console.log(res);
                    // UITVOER
                    //if (resultaat.status.success == true) { 
                     //   window.location.replace("admin.html");                          
                   // }
                   // else {
                      //  console.log('invalid');
                        /*label_fout = document.getElementById(modal_id).getElementsByClassName("note-danger")[0];
                        label_fout.innerHTML = resultaat.status.message;
                        label_fout.classList.remove("invisible");
                        label_fout.classList.add("visible");*/
                   // }
              // }
            //)
        //}
   // }
    //else {
        // UITVOER
      //  form_categorie.classList.add('was-validated');
    //}
}


