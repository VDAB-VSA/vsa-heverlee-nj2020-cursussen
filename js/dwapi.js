/**
 * This is a ready to use set of functions for the default dwAPI endpoints:
 * - GET item: dwapiRead()
 * - POST item: dwapiCreate()
 * - PUT item: dwapiUpdate()
 * - DELETE item: dwapiDelete()
 * - POST user/login: dwapiLogin()
 * - POST user/register: dwapiRegister()
 * - GET user/logout: dwapiLogout()
 * - GET user/reset_password: dwapiResetPassword()
 * 
 * For more documentation check https://dataweb.stoplight.io/studio/dwapi
 * 
 * Last updated on 29/06/2021, 19:55
 * (c) Bert Jansen - 2021
 */

// READ
async function dwapiRead(parameters) {   
    let url = parameters.endpoint +
        "?project=" + parameters.project + 
        "&entity=" + parameters.entity;

    if (typeof parameters.filter !== "undefined" && parameters.filter.length > 0) {
        url = url + "&filter=" + encodeURIComponent(JSON.stringify(parameters.filter))
    }
    if (typeof parameters.sort !== "undefined" && parameters.sort.length > 0) {
        url = url + "&sort=" + encodeURIComponent(JSON.stringify(parameters.sort))
    }
    if (typeof parameters.relation !== "undefined" && parameters.relation.length > 0) {
        url = url + "&relation=" + encodeURIComponent(JSON.stringify(parameters.relation))
    }
    if (typeof parameters.paging !== "undefined") {
        url = url + "&paging=" + encodeURIComponent(JSON.stringify(parameters.paging))
    }

    let headers = {
        'Content-Type': 'application/json'
    }
    if (typeof parameters.token != "undefined") {
        headers.Authorization = 'Bearer ' + parameters.token
    }

    let response = await fetch(url, {
        method: 'GET',
        headers: headers
    });

    return response.json()
        .then(data => {             
            return data; 
        });
}   


// CREATE
async function dwapiCreate(parameters) {   
    let url = parameters.endpoint +
        "?project=" + parameters.project + 
        "&entity=" + parameters.entity;

    if (typeof parameters.token_required !== "undefined") {
        url = url + "&token_required=" + encodeURIComponent(JSON.stringify(parameters.token_required))
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + parameters.token,
        }, 
        body: prepareBody(parameters.values)
    });

    return response.json()
        .then(data => {             
            return data; 
        }); 
}

// UPDATE
async function dwapiUpdate(parameters) {   
    let url = parameters.endpoint +
        "?project=" + parameters.project + 
        "&entity=" + parameters.entity + 
        "&filter=" + encodeURIComponent(JSON.stringify(parameters.filter));

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + parameters.token,
        },
        body: prepareBody(parameters.values)
        
    });

    return response.json()
        .then(data => {    
            return data; 
        }); 
}

// DELETE
async function dwapiDelete(parameters) {   
    let url = parameters.endpoint +
        "?project=" + parameters.project + 
        "&entity=" + parameters.entity;
 
    const response = await fetch(url, {
        method: 'DELETE',
        mod: 'cors',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + parameters.token,
        },
        body: JSON.stringify({"filter": parameters.filter})
    }); 

    return response.json()
        .then(data => {             
            return data; 
        }); 
}

function prepareBody(values) {
    //return JSON.stringify(values);
    let data = new FormData();
    if (values !== "undefined") {
        for (var key in values) {            
            if (Object.prototype.hasOwnProperty.call(values, key)) {
                data.set(key, values[key]);
            } 
        }
    } 
    return data;
}

// LOGIN
async function dwapiLogin(parameters) {   
    let url = parameters.endpoint +
        "?project=" + parameters.project;

    const response = await fetch(url, {
        method: 'POST',
        body: prepareBody({"email": parameters.email, "password": parameters.password})
    }); 

    return response.json()
        .then(data => {             
            return data; 
        }); 
}

// LOGOUT
async function dwapiLogout(parameters) {   
    let url = parameters.endpoint +
        "?project=" + parameters.project;

    const response = await fetch(url, {
        method: 'GET',  
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + parameters.token,
        },      
    });

    return response.json()
        .then(data => {             
            return data; 
        }); 
}

// VALIDATE TOKEN
async function dwapiValidateToken(parameters) {   
    let url = parameters.endpoint +
        "?project=" + parameters.project;

    const response = await fetch(url, {
        method: 'GET',  
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + parameters.token,
        },      
    });

    return response.json()
        .then(data => {             
            return data; 
        }); 
}


// REGISTER
async function dwapiRegister(parameters) {   
    let url = parameters.endpoint +
        "?project=" + parameters.project;

    const response = await fetch(url, {
        method: 'POST',          
        body: prepareBody(parameters.values)   
    });

    return response.json()
        .then(data => {             
            return data; 
        }); 
}

// RESET PASSWORD
async function dwapiResetPassword(parameters) {   

    let url = parameters.endpoint +
        "?project=" + parameters.project +
        "&email=" + encodeURIComponent(parameters.email);

    const response = await fetch(url, {
        method: 'GET',  
        headers: { 
            'Content-Type': 'application/json'
        },      
    });

    return response.json()
        .then(data => {             
            return data; 
        }); 
}