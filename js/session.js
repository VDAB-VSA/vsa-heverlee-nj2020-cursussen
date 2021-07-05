//let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo2LCJleHAiOjE2MjQ5ODg2MjQsImlzcyI6IjRucW1sUkFpRTVjRyIsImlhdCI6MTYyNDk1MjYyNH0.LfLNZxFzMbipADXygMXoNMQo5yiXlLtuxekPTsFiY7Q";
//let dwapi_url = "https://dwapi.dev";
//let project = "4nqmlRAiE5cG";

window.onload = function() {
 //toonVanLocalstorage();
//toonVanSessionStorage();
CheckSession();
document.getElementById("button_logout").addEventListener('click', logout);
};

function CheckSession() {

let gebruiker = JSON.parse(window.sessionStorage.getItem("user"));
if(gebruiker){
  let session = gebruiker[0].token != null ? "true" : "false";
  if(session == false) {
    alert("Your Session has expired");
    window.location.replace("index.html");
}
else{
  return false;
}
window.location.replace("index.html");
}}

function logout() {

  /*let logout_parameters = {
    "endpoint": dwapi_url + "/user/logout",
    "project": project,                
    "token": token
};

let logout_request = dwapiLogout(logout_parameters);
logout_request.then(data => {
console.log(data);
});*/
  sessionStorage.removeItem('user');
  //sessionStorage.removeItem('itemName'); 
  //location.replace("index.html");
 window.location.replace("index.html");
}
/*function toonVanLocalstorage() {
    //invoeren
    let gebruikers_lijst = document.getElementById("ol");
    
    let tekst_gebruikers = window.localStorage.getItem("users")
    console.log(tekst_gebruikers);
    let gebruikers = JSON.parse(tekst_gebruikers);
    console.log(gebruikers);
    //gebruikers = JSON.parse(window.localStorage.getItem("users"));
    
    


    //verwerken
    gebruikers.map((gebruiker)=>{
      let gebruiker_info = document.createElement("li");
      gebruiker_info.className = "list-group-item d-flex justify-content-between align-items-start";
      gebruiker_info.innerHTML= `
      <div class="ms-2 me-auto">
        <div class="fw-bold">${gebruiker.naam}</div>
        ${gebruiker.email}
      </div>
      <span class="badge bg-primary rounded-pill">${gebruiker.leeftijd}</span>`;

      gebruikers_lijst.appendChild(gebruiker_info);
    })
   }

   function toonVanSessionStorage() {
    //invoeren
    let gebruikers_lijst = document.getElementById("ul");
    gebruikers = JSON.parse(window.sessionStorage.getItem("users"));
      
    //verwerken
    gebruikers.map((gebruiker)=>{
      let gebruiker_info = document.createElement("li");
      gebruiker_info.className = "list-group-item d-flex justify-content-between align-items-start";
      gebruiker_info.innerHTML= `
      <div class="ms-2 me-auto">
        <div class="fw-bold">${gebruiker.naam}</div>
        ${gebruiker.email}
      </div>
      <span class="badge bg-primary rounded-pill">${gebruiker.leeftijd}</span>`;

      gebruikers_lijst.appendChild(gebruiker_info);
    })
   }*/
 
   /*function register(res){
 
    //verwerken
    let gebruiker_info = {
      id: res.item.user_id,
      naam:res.item.Naam,
      email: res.item.email,
      token: res.extended_token      
    }
    let gebruiker_lijst = JSON.parse(window.localStorage.getItem("users")) || [];
    let nieuw_lijst = [...gebruiker_lijst];
 
    //uitvoer
    nieuw_lijst.push(gebruiker_info);

    window.localStorage.setItem("users", JSON.stringify(nieuw_lijst));
    window.sessionStorage.setItem("users", JSON.stringify(nieuw_lijst));
   }

   function session_destroy(id){
       
       
   }*/
