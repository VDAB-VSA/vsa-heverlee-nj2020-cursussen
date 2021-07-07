let token_1 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo2LCJleHAiOjE2MjUxMjY3OTAsImlzcyI6IjRucW1sUkFpRTVjRyIsImlhdCI6MTYyNTA5MDc5MH0.CNT_o_QaqvgWfGyM6V4ta6DwB8yj2PVbN5ThJNQq3BE";
const endpoint_1 = "https://dwapi.dev";
const project_1 = "4nqmlRAiE5cG";

let boodschap_success = 
  '<div class="success_boodschap col-md-12">'
  + '<p><i class="fas fa-check-circle fa-2x"></i></p>'
  + '<p>Uw account is nu aangemaakt !'
  + '<br> Er zal u een e-mail worden gestuurd om dit te bevestigen</p>'
  + '</div>'
;

let boodschap_fout = 
  '<div class="fout_boodschap col-md-12">'
  + '<p><i class="fas fa-times-circle fa-2x"></i></p>'
  + '<p>Er was een probleem. <br>Probeer het later nog eens of neem contact met ons op.</p>'
  + '</div>'
;

window.onload = function(){

  let ik_ben_bedrijf = document.querySelector("input[name='ik_ben_bedrijf']");

  ik_ben_bedrijf.addEventListener('change', function() {
    if (this.checked) {
      console.log("Checkbox is checked..");
    } else {
      console.log("Checkbox is not checked..");
    }
  });

  /* bedrijf velden tonen als checkbox 'ik ben bedrijf' is ja */
  //document.getElementById("ik_ben_bedrijf").addEventListener('click', tonenVeldenBedrijf);

  /* registreren nieuwe gebruiker */
  document.getElementById("button_verzenden_regisreren").addEventListener('click', registreren);
}

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
      "endpoint" : endpoint_1 + "/user/register",
      "project" : project_1,
      "entity" : "user",
      "values" : values_user,
      "token" : token_1,
    };

    /*fetch create uitvoeren: dwapiRegister */
    let register_request = dwapiRegister(parameters);
    register_request.then(
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



let ik_ben_bedrijf = document.querySelector("input[name=ik_ben_bedrijf]");

ik_ben_bedrijf.addEventListener('change', function() {
  if (this.checked) {
    console.log("Checkbox is checked..");
  } else {
    console.log("Checkbox is not checked..");
  }
});

//let ik_ben_bedrijf = document.getElementById("ik_ben_bedrijf");
/*
let velden_te_tonen = document.getElementsByClassName("form_bedrijf");

console.log(velden_te_tonen)

ik_ben_bedrijf.onclick = function() {
  if (this.checked) {
    velden_te_tonen.style.display = 'block';
  }
};
*/

/*
function tonenVeldenBedrijf() {
  let ik_ben_bedrijf = document.getElementById("ik_ben_bedrijf");
  let velden_te_tonen = document.getElementsByClassName("form_bedrijf");
  if (ik_ben_bedrijf.checked == true){
    velden_te_tonen.style.display = "block";
  } else {
    velden_te_tonen.style.display = "none";
  }
}
*/



/*
function myFunction() {
  // Get the checkbox
  let ik_ben_bedrijf = document.getElementById("ik_ben_bedrijf");
  // Get the output text
  let velden_te_tonen = document.getElementsById("btw_nummer");


  // If the checkbox is checked, display the output text
  if (ik_ben_bedrijf.checked == true){
    velden_te_tonen.style.display = "block";
  } else {
    velden_te_tonen.style.display = "none";
  }
}
*/

/*
checkbox = document.getElementById('checkbox');
var box = document.getElementById('box');
checkbox.onclick = function() {
    console.log(this);
    if (this.checked) {
        box.style['display'] = 'block';
    } else {
        box.style['display'] = 'none';
    }
};   
function bedrijfVeldenTonen() {
  //let ik_ben_bedrijf = document.getElementById("ik_ben_bedrijf").checked;
}
*/


