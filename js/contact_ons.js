

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

}