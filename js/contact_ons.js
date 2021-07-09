
/*
function boodschap() {

  if(document.getElementById("naam_contactpersoon").value != "" && document.getElementById("email_contactpersoon").value !=""
  && document.getElementById("bericht_contactpersoon").value !=""
  ){
    document.getElementById("boodschap_contact_formulier").innerHTML = `<div class="alert alert-success" role="alert" data-mdb-color="success">
    <i class="fas fa-check-circle me-3"></i>Uw bericht is verzonden! Wij zullen zo spoedig mogelijk contact met u opnemen.
</div>`;
  }else{
    document.getElementById("boodschap_contact_formulier").innerHTML = `<div class="alert alert-danger" role="alert" data-mdb-color="danger">
    <i class="fas fa-times-circle me-3"></i>Uw bericht is niet verzonden! Gelieve vul de verplichte velden correct in!
</div>`;
  }

} */

window.addEventListener('load', (event) => {
  console.log("onloadcontact");
  document.getElementById("verstuur_button").addEventListener('click', function() {
      contactForm();
   })
  console.log('inloggen1');
});


function contactForm() {
  console.log('inloggen3');
  // INVOER
  let gebruiker_naam= document.getElementById("naam_contactpersoon").value;
  let gebruikeremail= document.getElementById("email_contactpersoon").value;
  let telefoon = document.getElementById("telefoon_contactpersoon").value;
  let inschrijvingsnummer = document.getElementById("inschrijvingsnummer").value;
  let bericht_contactpersoon = document.getElementById("bericht_contactpersoon").value;


  // VERWERKING
  let form_contact = document.getElementById("contact_form");
  if (form_contact.checkValidity()) {
    console.log("chekvalidity is true")
     let gebruiker_vraag = {
       "naam": gebruiker_naam,
       "email": gebruikeremail,
       "telefoon": telefoon,
       inschrijvingsnummer,   
       "type_vraag": "type",
       "bericht": bericht_contactpersoon,
       "gdpr1": 1,
       "gdpr2": 1 

     }
      let parameters = {
          "endpoint": endpoint,
          "project": project,
          "entity" : "contact_formulier",
          /*"naam" : gebruiker_naam,               
          "email": gebruikeremail,*/
          "values": gebruiker_vraag,
          "token_required": false
      }
          let res = dwapiCreate(parameters)
          .then(
             resultaat => {
                  // UITVOER
                 console.log(resultaat);
               if (resultaat.status.success == true) { 
                document.getElementById("boodschap_contact_formulier").innerHTML = `<div class="alert alert-success" role="alert" data-mdb-color="success">
                <i class="fas fa-check-circle me-3"></i>Uw bericht is verzonden! Wij zullen zo spoedig mogelijk contact met u opnemen.
                </div>`;

                      /*label_succes = document.getElementById("inloggen_succes_boodschap");
                      label_succes.innerHTML = `<div class="alert alert-success" role="alert" data-mdb-color="success">
                      <i class="fas fa-check-circle me-3"></i>Je logged succes in!
                      </div>`;
                      label_succes.classList.remove("invisible");
                      label_succes.classList.add("visible");

                      setTimeout(function(){
                          window.location = "index.html";
                         }, 3000);

                      //window.location.replace("index.html"); 
                  }  */                       
                }
               else {
                document.getElementById("boodschap_contact_formulier").innerHTML = `<div class="alert alert-danger" role="alert" data-mdb-color="danger">
                <i class="fas fa-times-circle me-3"></i>Uw bericht is niet verzonden! Gelieve vul de verplichte velden correct in!
                </div>`;

                      /*label_fout = document.getElementById("inloggen_fout_boodschap");

                      let message = boodschap[resultaat.status.error_code];
                      label_fout.innerHTML = message;
                      label_fout.classList.remove("invisible");
                      label_fout.classList.add("visible");*/
                  }
            // }
          //)
      //}
  })
}
  else {
      //UITVOER
      contact_form.classList.add('was-validated');
  }
}