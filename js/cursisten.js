window.onload = function(){
    toonProductenTabel();
    toonSorteerRichting();
    eventListenersVoorStatischeElementen();
    categorieenLadenInSelects();
}

function eventListenersVoorStatischeElementen() {

    document.getElementById("zoekcursist").addEventListener('click', function() {
        zoekCursist();
    })
}

function zoekCursist(){
     // INVOER
     let naam = document.getElementById("naam").value;
     let tel = document.getElementById("telefoon").value;
     let email = document.getElementById("e-mail").value;

     console.log(naam, tel);
}