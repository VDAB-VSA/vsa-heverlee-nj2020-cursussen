const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjQsImV4cCI6MTYyMTcyNDEzMCwiaXNzIjoiTGx1RzNnd1pLUHpDIiwiaWF0IjoxNjIxNjg4MTMwfQ.CZUa2nwdwFepcvUuV7mADgmZEvoDDIct8TI52IoGcfI";
const endpoint = "https://dwapi.dev/item";
const project = "4nqmlRAiE5cG";

let huidige_cursist_actie;
let huidige_cursist_id;
let huidige_filter_waardes = [];
let huidige_sorteer_waarde = ["naam", "ASC"];

window.onload = function(){
    toonProductenTabel();
    toonSorteerRichting();
    eventListenersVoorStatischeElementen();
    categorieenLadenInSelects();
}

function toonProductenTabel() {
    let parameters = {
        "endpoint": endpoint, 
        "project": project,
        "token": token, 
        "entity": "product",
        "filter": huidige_filter_waardes,
        "sort": huidige_sorteer_waarde,
        "relation": [{"pri_entity": "product", "pri_key": "categorie_id", "sec_entity": "product_categorie", "sec_key": "id"}]
    }
    
    dwapiRead(parameters).then(
        data => {
            let tabel_producten_html =  "<table>";
            data.result.items.forEach(function(product) {
                let categorie_naam = "";
                if (product.categorie_id != null) {
                    categorie_naam = product.product_categorie.items[product.categorie_id].naam;
                }
                let beeld = "";
                if (product.image != null && product.image != "") {
                    beeld = '<img src="https://' +  data.result.assets_path + "/" +  product.image.name + '" />';
                }
                tabel_producten_html += "<tr>" +
                    "<td>" + product.naam + "</td>" +
                    "<td>€ " + product.prijs + "</td>" + 
                    "<td>" + categorie_naam + "</td>" + 
                    "<td>" + beeld + "</td>" + 
                    "<td>" + 
                        "<button "+
                            "data-product-id='" + product.id + "' "+ 
                            "data-product-actie='update' " +
                            "class='button-toon-product-modal call-btn btn btn-outline-primary btn-floating btn-sm' "+
                            "data-mdb-toggle='modal' " +
                            "data-mdb-target='#modal_product'>" +
                            "<i class='fa fa-pen'></i>" +
                            "</button>" +
                        "<button " + 
                            "data-product-id='" + product.id + "' " +
                            "data-product-naam='"+ product.naam + "' " +
                            "class='button-toon-product-verwijderen-modal message-btn btn ms-2 btn-outline-dark btn-floating btn-sm' " +
                            "data-mdb-toggle='modal' " +
                            "data-mdb-target='#modal_product_verwijderen'>" +
                            "<i class='fa fa-trash'></i>" + 
                            "</button>" + 
                    "</td>"
                + "</tr>";
            });
            tabel_producten_html += "</table>";

            document.getElementById("tabel_producten").innerHTML = tabel_producten_html;

            eventListenersVoorDynamischeElementen();            
        }
    )
}

//function productToevoegen() -> productBewaren()
//function productWijzigen() -> productBewaren()

function productBewaren() {
    // INVOER
    let product_naam = document.getElementById("input_product_naam").value;
    let product_omschrijving = document.getElementById("input_product_omschrijving").value;
    let product_prijs = document.getElementById("input_product_prijs").value;
    let product_categorie_id = document.getElementById("select_product_categorie").value;    
    let product_beeld_origineel = document.getElementById("input_product_beeld_origineel").value; 
    let product_in_voorraad = document.getElementById("check_product_in_voorraad").checked;
    let input_product_beeld = document.getElementById("input_product_beeld"); 

    // VERWERJING
    if (product_in_voorraad == true) {
        product_in_voorraad = 1;
    }
    else {
        product_in_voorraad = 0;
    }

    let product_beeld;
    if (input_product_beeld.files.length == 1) {
        product_beeld = input_product_beeld.files[0];
    }
    else {
        product_beeld = product_beeld_origineel;
    }

    let form_product = document.getElementById("form_product");
    if (form_product.checkValidity()) {
        let product = {
            "naam": product_naam, 
            "omschrijving": product_omschrijving, 
            "prijs": product_prijs, 
            "categorie_id": product_categorie_id,
            "image": product_beeld,
            "in_voorraad": product_in_voorraad,
        };
 
        let parameters = {
            "endpoint": endpoint, 
            "project": project,
            "token": token, 
            "entity": "product",
            "values": product};

        if (huidige_product_actie == "update") {
            parameters.filter = ["id", "=", huidige_product_id];
            dwapiUpdate(parameters).then(
                resultaat => {
                    // UITVOER
                    verwerkResultaatNaProductActie(resultaat, "modal_product");                    
                }
            )
        }
        else {
            dwapiCreate(parameters).then(
                resultaat => {
                    // UITVOER
                    verwerkResultaatNaProductActie(resultaat, "modal_product");
                }
            )
        }
    }
    else {
        // UITVOER
        form_product.classList.add('was-validated');
    }
}

function productVerwijderen(product_id) {
    // INVOER
    let parameters = {
        "endpoint": endpoint, 
        "project": project,
        "token": token, 
        "entity": "product",
        "filter": ["id", "=", product_id]}

    // VERWERKING
    dwapiDelete(parameters).then(
        resultaat => {
            verwerkResultaatNaProductActie(resultaat, "modal_product_verwijderen");
        }
    )
}

function productenFilteren() {
    // INVOER
    huidige_filter_waardes = [];
    let filter_naam = document.getElementById("input_filter_naam").value;
    let filter_categorie_id = document.getElementById("select_filter_categorie").value;    
    let filter_in_voorraad = "";
    if (document.getElementById("check_filter_in_voorraad").disabled == false) {
        filter_in_voorraad = Number(document.getElementById("check_filter_in_voorraad").checked);
    }

    // VERWERKING
    if (String(filter_naam) != "") {
        huidige_filter_waardes.push(["naam", "LIKE", "%" + filter_naam + "%"]);
    }
    if (String(filter_categorie_id) != "") {
        huidige_filter_waardes.push(["categorie_id", "=", filter_categorie_id]);
    }
    if (String(filter_in_voorraad) != "") {
        huidige_filter_waardes.push(["in_voorraad", "=", filter_in_voorraad]);
    }

    // UITVOER
    toonProductenTabel();
}

function productenFilterenReset() {
    document.getElementById("input_filter_naam").value = "";
    document.getElementById("select_filter_categorie").value = "";
    document.getElementById("check_filter_in_voorraad").disabled = true;
    productenFilteren();
}

function productenSorteren(link) {
    // INVOER
    let sorteer_op = link.dataset.sorteerOp;

    // VERWERKING    
    let sorteer_richting = "ASC";
    if (huidige_sorteer_waarde[0] == sorteer_op && huidige_sorteer_waarde[1] == "ASC") {
        sorteer_richting = "DESC";
    }
    
    huidige_sorteer_waarde = [sorteer_op, sorteer_richting];
    
    // UITVOER
    toonProductenTabel();
    toonSorteerRichting();
}

// ------------------ //

function eventListenersVoorStatischeElementen() {

    document.getElementById("button_product_bewaren").addEventListener('click', function() {
        productBewaren();
    })

    document.getElementById("button_product_verwijderen").addEventListener('click', function() {
        productVerwijderen(huidige_product_id);
    })

    document.getElementById("button_producten_filteren").addEventListener('click', function() {
        productenFilteren();
    })

    document.getElementById("button_producten_filteren_reset").addEventListener('click', function() {
        productenFilterenReset();
    })

    document.getElementById("div_check_filter_in_voorraad").addEventListener('click', function() {
        if (document.getElementById("check_filter_in_voorraad").disabled == true) {
            document.getElementById("check_filter_in_voorraad").disabled = false;
            document.getElementById("check_filter_in_voorraad").checked = true;
        }
    })
    
    let sorteer_links;
    sorteer_links = document.querySelectorAll('.link-producten-sorteren');
    for (var i = 0; i < sorteer_links.length; i++) {
        sorteer_links[i].addEventListener('click', function() {            
            productenSorteren(this);
        })
    }
}

function eventListenersVoorDynamischeElementen() {
    /* "product toevoegen" knop (statisch) en "product wijzigen" knoppen (dynamisch) */
    let toon_product_modal_buttons;
    toon_product_modal_buttons = document.querySelectorAll('.button-toon-product-modal');
    if (toon_product_modal_buttons) {
        for (var i = 0; i < toon_product_modal_buttons.length; i++) {
            toon_product_modal_buttons[i].addEventListener('click', function() {                
                toonProductModal(this);
            });            
        }        
    }

    /* "product verwijderen" knoppen */
    buttons = document.querySelectorAll('.button-toon-product-verwijderen-modal');
    if (buttons) {
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', function() {                
                toonProductVerwijderenModal(this);
            });            
        }           
    }
}

function categorieenLadenInSelects() {
    let parameters = {
        "endpoint": endpoint, 
        "project": project,
        "token": token, 
        "entity": "product_categorie"
    }
    
    dwapiRead(parameters).then(
        data => {
            let select_filter_categorie = document.getElementById("select_filter_categorie");
            let select_product_categorie = document.getElementById("select_product_categorie");
            let categorie_opties = "";
            data.result.items.forEach(function(categorie) {
                categorie_opties += "<option value='" + categorie.id + "'>" + categorie.naam + "</option>";
            });
            select_filter_categorie.innerHTML = "<option value=''>alle</option>" + categorie_opties;
            select_product_categorie.innerHTML = "<option value=''></option>" + categorie_opties;
        });
}

function toonProductModal(via_button) {
    // INVOER
    huidige_product_actie = via_button.dataset.productActie;
    huidige_product_id = via_button.dataset.productId;
 
    // UITVOER
    resetProductFormulier();  
    if (huidige_product_actie == "create") {
        document.getElementById("modal_product_titel").innerHTML = "Nieuw product toevoegen";
    }
    if (huidige_product_actie == "update") {
        document.getElementById("modal_product_titel").innerHTML = "Product wijzigen";
        toonHuidigProductInFormulier();
    }

    // verwijder vorige validatie
    document.getElementById("form_product").classList.remove('was-validated');
}

function toonProductVerwijderenModal(via_button) {
    // VERWERKING
    huidige_product_id = via_button.dataset.productId;

    // UITVOER
    document.getElementById("label_product_verwijderen").innerHTML = "Wil u product <strong>" + via_button.dataset.productNaam + "</strong> echt verwijderen?";
}


function toonHuidigProductInFormulier() {

    let parameters = {
        "endpoint": endpoint, 
        "project": project,
        "token": token, 
        "entity": "product",
        "filter": ["id", "=", huidige_product_id]
    }
    
    dwapiRead(parameters).then(
        data => {
            let product = data.result.items[0];
            document.getElementById("input_product_naam").value = product.naam;
            document.getElementById("input_product_omschrijving").value = product.omschrijving;
            document.getElementById("input_product_prijs").value = product.prijs;
            document.getElementById("select_product_categorie").value = product.categorie_id;
            document.getElementById("check_product_in_voorraad").checked = product.in_voorraad;   
            let product_beeld_origineel = "";
            if (product.image != "") {
                product_beeld_origineel = JSON.stringify(product.image);
            }         
            document.getElementById("input_product_beeld_origineel").value = product_beeld_origineel;
        }); 
}

function resetProductFormulier() {
    document.getElementById("input_product_naam").value = "";
    document.getElementById("input_product_omschrijving").value = "";
    document.getElementById("input_product_prijs").value = "";
    document.getElementById("select_product_categorie").value = "";
    document.getElementById("input_product_beeld_origineel").value = "";
    document.getElementById("input_product_beeld").value = "";
    document.getElementById("label_product_beeld").innerHTML = "Kies (nieuw) beeld";

    document.getElementById("label_product_fout").classList.remove("visible");
    document.getElementById("label_product_fout").classList.add("invisible");
}

function toonSorteerRichting() {
    // De arrow-up en arrow-down class van alle sorteer links verwijderen
    let alle_sorteer_links = document.querySelectorAll('.link-producten-sorteren');
    for (var i = 0; i < alle_sorteer_links.length; i++) {
        let icon = alle_sorteer_links[i].getElementsByTagName("i")[0];
        icon.classList.remove("fa-arrow-up");
        icon.classList.remove("fa-arrow-down");
    }

    // Op de link van de huidige sortering de arrow-up of arrow-down class toevoegen
    let link = document.getElementById("link_sorteer_op_" + huidige_sorteer_waarde[0]);
    let icon = link.getElementsByTagName("i")[0];
    if (huidige_sorteer_waarde[1] == "ASC") {
        icon.classList.add("fa-arrow-down");
    }
    else {
        icon.classList.add("fa-arrow-up");
    }
}

function verwerkResultaatNaProductActie(resultaat, modal_id) {
    if (resultaat.status.success == true) {                              
        toonProductenTabel();
        $("#" + modal_id).modal('hide');
    }
    else {
        label_fout = document.getElementById(modal_id).getElementsByClassName("note-danger")[0];
        label_fout.innerHTML = resultaat.status.message;
        label_fout.classList.remove("invisible");
        label_fout.classList.add("visible");
    }
}