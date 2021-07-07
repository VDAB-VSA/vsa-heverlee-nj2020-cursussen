window.onload = function() {
checkSessie();
//document.getElementById("button_logout").addEventListener('click', logout);
};

function checkSessie() {
let gebruiker = JSON.parse(window.sessionStorage.getItem("user"));

//console.log('sess', gebruiker);
  if(gebruiker == null){
   /*  let session = gebruiker[0].token != null ? "true" : "false";
    if(session == false) {
      //alert("Your Session has expired");
      window.location.replace("index.html");
    }
  }
  else { */
  //setTimeout(() => redirectMessage, 40000);
  window.location = "index.html";
  }
}

function logout() {
  console.log('logout');
 sessionStorage.removeItem('user');
 window.location.replace("index.html");

}


/*function redirectMessage() {
  let body = document.getElementsByTagName('body');
    body.innerHtml  = "🔏 Trying to access secured admin page";
}*/
