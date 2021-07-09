
//EVENTLISTENER
window.addEventListener('load', (event) => {
  console.log("onloadcontact");
  document.getElementById("verstuur_button").addEventListener('click', function() {
      contactForm();
   })
});


function contactForm() {
  // INVOER
  let gebruiker_naam= document.getElementById("naam_contactpersoon").value;
  let gebruikeremail= document.getElementById("email_contactpersoon").value;
  let telefoon = document.getElementById("telefoon_contactpersoon").value;
  let inschrijvingsnummer = document.getElementById("inschrijvingsnummer").value;
  let bericht_contactpersoon = document.getElementById("bericht_contactpersoon").value;
  let form_contact = document.getElementById("contact_form");

  // VERWERKING
  
  if (form_contact.checkValidity()) {
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
      "values": gebruiker_vraag,
      "token_required": false
    }
    let res = dwapiCreate(parameters)
    .then(
      resultaat => {
        // UITVOER
        if (resultaat.status.success == true) { 
        document.getElementById("boodschap_contact_formulier").innerHTML = `<div class="alert alert-success" role="alert" data-mdb-color="success">
        <i class="fas fa-check-circle me-3"></i>Uw bericht is verzonden! Wij zullen zo spoedig mogelijk contact met u opnemen.
        </div>`;                    
        }
        else {
          document.getElementById("boodschap_contact_formulier").innerHTML = `<div class="alert alert-danger" role="alert" data-mdb-color="danger">
          <i class="fas fa-times-circle me-3"></i>Uw bericht is niet verzonden! Gelieve vul de verplichte velden correct in!
          </div>`;
        }
      }
    )
  }
  else {
    //UITVOER
    document.getElementById("boodschap_contact_formulier").innerHTML = `<div class="alert alert-danger" role="alert" data-mdb-color="danger">
                <i class="fas fa-times-circle me-3"></i>Uw bericht is niet verzonden! Gelieve vul de verplichte velden correct in!
                </div>`;
      
    contact_form.classList.add('was-validated');
  }
}