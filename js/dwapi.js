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

    let response = await fetch(url, {
        method: 'GET'
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