
const serverUrl = 'http://localhost:5500/api'

//CORRECT FOR EASY DINNER

export async function getTables(profile) {
    const data = await callAPI(`table`, 'POST', { profile })
    return data
}

export async function getOrderOfTable(profile, tableId) {
    const data = await callAPI(`table/getOrders`, 'POST', { profile, tableId })
    return data
}


export async function getOrderById(profile, orderId, fullDetail = false) {
    const data = await callAPI(`order/byId`, 'POST', { profile, orderId, fullDetail })
    return data
}

export async function getFromSection(sectionId, profile) {
    const data = await callAPI(`section`, 'POST', { sectionId, profile })
    return data
}

export async function getPreviousSectionId(sectionId, profile) {
    const data = await callAPI(`section/previousId`, 'POST', { sectionId, profile })
    return data
}

export async function getProductByName(profile, research) {
    const data = await callAPI(`product/byName`, 'POST', { research, profile })
    return data
}

export async function getProductById(productId, profile) {
    const data = await callAPI(`product/byId`, 'POST', { productId, profile })
    return data
}

export async function sendOrder(profile, tableId, order) {
    const data = await callAPI(`table/addOrder`, 'POST', { profile, tableId, order })
    return data
}

export async function setToken(profile, token) {
    const data = await callAPI(`website/addToken`, 'POST', { profile, token })
    return data
}

export async function getToken(profile, token) {
    const data = await callAPI(`website/getToken`, 'POST', { profile, token })
    return data
}

export async function removeToken(profile, token) {
    const data = await callAPI(`website/removeToken`, 'POST', { profile, token })
    return data
}

export async function removeOrderById(profile, orderId) {
    const data = await callAPI(`order/removeById`, 'POST', { profile, orderId })
    return data
}

export async function changeStatusOfOrder(profile, orderId, status, tableId, destinationId) {
    const data = await callAPI(`order/changeOrderStatus`, 'POST', { profile, orderId, status, tableId, destinationId })
    return data
}

export async function getWorkerByIdFromDB(profile, workerId) {
    return await callAPI(`worker/byId`, "POST", { profile, workerId })
}

export async function changeStatusOfTable(profile, tableId, statusId) {
    return await callAPI(`table/changeStatus`, "POST", { profile, tableId, statusId })
}



//CORRECT FOR CAFE GREG ONLY


export async function addTableById(id) {
    try {
        const response = await fetch(`${serverUrl}/table/${id}/addTable`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json().catch(() => ({
            success: false,
            message: "Réponse serveur invalide"
        }));

        console.log(data.message);

        return data;

    } catch (error) {
        console.error("❌ Erreur réseau:", error);
        return { success: false, message: "Erreur réseau" };
    }
}



export async function getCustomersFromTable(tableId) {
    try {
        const response = await fetch(`${serverUrl}/table/${tableId}/customers`);
        const data = await response.json();
        console.log(data);
        return data
    } catch (error) {
        console.error("Erreur réseau :", error);
    }
}

export async function registerCustomerToTable(tableId, name, id, contact) {
    try {
        const response = await fetch(`${serverUrl}/customer/register/${tableId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name, contact, id
            })
        });
        return response
    } catch (error) {
        console.error("Erreur réseau :", error);
    }
}

export async function loginCustomerToTable(tableId, id) {
    try {
        const response = await fetch(`${serverUrl}/customer/login/${tableId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id
            })
        });
        return response
    } catch (error) {
        console.error("Erreur réseau :", error);
    }
}

export async function logOutCustomerFromATable(customerId) {
    try {
        const response = await fetch(`${serverUrl}/customer/disconnect`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: customerId
            })
        });
        return response
    } catch (error) {
        console.error("Erreur réseau :", error);
    }
}

export async function deleteTableDB(tableId) {
    try {
        const response = await fetch(`${serverUrl}/table/${tableId}/delete`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });
        return response
    } catch (error) {
        console.error("Erreur réseau :", error);
    }
}

export async function payTableInDB(tableId, tipValue) {
    try {
        const response = await fetch(`${serverUrl}/table/${tableId}/payTable/${tipValue}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });
        return response
    } catch (error) {
        console.error("Erreur réseau :", error);
    }
}

export async function getPriceOfTable(tableId) {
    try {
        const response = await fetch(`${serverUrl}/table/${tableId}/priceOfTable`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        const data = await response.json();

        return data.price
    } catch (error) {
        console.error("Erreur réseau :", error);
    }
}

export async function getHistoryOfCustomers(customers, date1, date2) {

    try {
        const response = await fetch(`${serverUrl}/customer/history`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                customers, date1, date2
            })
        });

        // Transformer la réponse en JSON
        const data = await response.json();

        return data.orders
    } catch (error) {
        console.error("Erreur réseau :", error);
    }
}


export async function callAPI(api, method, body) {
    try {
        const response = await fetch(`${serverUrl}/${api}`, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        // Transformer la réponse en JSON
        const data = await response.json();
        return data
    } catch (error) {
        console.error("Erreur réseau :", error);
    }
}


export async function switchTables(tableId1, tableId2) {
    await callAPI(`table/${tableId1}/switchWith/${tableId2}`, 'POST')
}


export async function getOrdersFromDestionation(destinationId) {
    return await callAPI(`order/fromDestination/${destinationId}`, 'GET')
}


export async function connectToWebsite(login, password, token) {
    return await callAPI(`website/connect`, 'POST', { login, password, token })
}

export async function workerEntry(workerId, clickerId) {
    return await callAPI(`worker/entry`, 'POST', { workerId, clickerId })
}

export async function workerPause(workerId, clickerId) {
    return await callAPI(`worker/pause`, 'POST', { workerId, clickerId })
}

export async function getWorkerEntries(workerId) {
    return await callAPI(`worker/getEntries`, 'POST', { workerId })
}

export async function getEveryEntriesWithWorkers() {
    const data = await callAPI(`worker/getEveryEntriesWithWorkers`, 'POST')
    return data.entriesWithWorkers
}

export async function fetchEveryProducts() {
    const data = await callAPI(`product/`, 'GET')
    return data
}

export async function sendNewProduct(newProduct) {
    const data = await callAPI(`product/changeProduct`, 'POST', { newProduct })
    return data
}

export async function getEveryStatus() {
    const data = await callAPI(`status`, 'GET')
    return data
}
