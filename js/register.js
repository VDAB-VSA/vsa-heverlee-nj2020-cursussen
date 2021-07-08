let boodschap_success = `<div class="success_boodschap col-md-12">
                          <p><i class="fas fa-check-circle fa-2x"></i></p>
                          <p>Uw account is nu aangemaakt ! <br> Er zal u een e-mail worden gestuurd om dit te bevestigen</p>
                          </div>`;

let boodschap_fout = `<div class="fout_boodschap col-md-12">
                         <p><i class="fas fa-times-circle fa-2x"></i></p>
                        <p>Er was een probleem. <br>Probeer het later nog eens of neem contact met ons op.</p>
                      </div>`;

window.addEventListener('load', (event) => {
  document.getElementById("button_verzenden_regisreren").addEventListener('click', function() {
      registreren();
   })
});


function registreren() {
  //INVOER
  /* invoer modal formulier ophalen */
  let naam_user = document.getElementById("registreren_naam").value;
  let voornaam_user = document.getElementById("registreren_voornaam").value;
  let adres_user =  document.getElementById("registreren_adres").value;
  let postcode_user = document.getElementById("postcode").value;
  let stad_user = document.getElementById("registreren_stad").value;
  let telefoon_user = document.getElementById("registreren_phone").value;
  let naam_bedrijf = document.getElementById("naam_bedrijf").value;
  let adres_bedrijf = document.getElementById("adres_bedrijf").value;
  let postcode_bedrijf = document.getElementById("postcode_bedrijf").value;
  let stad_bedrijf = document.getElementById("registreren_stad_bedrijf").value;
  let btw_nummer_bedrijf = document.getElementById("btw_nummer").value;
  let email_user = document.getElementById("registreren_email").value;
  let wachtwoord_user = document.getElementById("registreren_paswoord").value;

  // VERVERKING
  let form_registreren = document.getElementById("form_registreren");
  
  /*frontend validatie */
  if (form_registreren.checkValidity()) {
    let values_user = {
      "naam" : naam_user,
      "voornaam" : voornaam_user,
      "email" : email_user,
      "password" : wachtwoord_user,
      "telefoon" : telefoon_user,
      "adres" : adres_user,
      "postcode" : postcode_user,
      "stad" : stad_user,
      "btw_nummer" : btw_nummer_bedrijf,
      "bedrijf_naam" : naam_bedrijf,
      "bedrijf_adres" : adres_bedrijf,
      "bedrijf_postcode" : postcode_bedrijf,
      "bedrijf_stad" : stad_bedrijf,
    };

    let parameters = {
      "endpoint" : tweede_endpoint + "/user/register",
      "project" : project,
      "entity" : "user",
      "values" : values_user,
      "token" : token,
    };

    /*fetch create uitvoeren: dwapiRegister */
    dwapiRegister(parameters).then(
      resultaat => {

        // UITVOER
        /*Resultaat boodschap tonen (succesvol of niet succesvol)*/
        if (resultaat.status.success == true) { 
          document.getElementById("form_registreren").innerHTML = boodschap_success;

        /* redirectie naar andere pagina */  
          window.setTimeout(function(){
            window.location.replace("winkelwagentje.html");
          }, 3000);                         
        }

        else {
          document.getElementById("form_registreren").innerHTML = boodschap_fout;
        }
      }
    )
  }

  else {
    form_registreren.classList.add('was-validated');
  }
}