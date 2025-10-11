const serverUrl = 'http://localhost:5500/api'

export async function getTables() {

    try {
        const response = await fetch(`${serverUrl}/table`)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const tables = await response.json()
        console.log(tables);

        return tables
    } catch (error) {
        console.error('Error fetching tables:', error)
        throw error
    }
}

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

        return data; // { success: true/false, message: "...", table?: {...} }

    } catch (error) {
        console.error("❌ Erreur réseau:", error);
        return { success: false, message: "Erreur réseau" };
    }
}

export async function sendOrder(tableId, order) {
    try {
        const response = await fetch(`${serverUrl}/table/${tableId}/order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                order
            })
        });

        const data = await response.json().catch(() => ({
            success: false,
            message: "Réponse serveur invalide"
        }));

        if (!response.ok || !data.success) {
            console.error("❌ Erreur API:", data.message);
            return { success: false, message: data.message };
        }

        console.log("✅ Commande ajoutée:", data);
        return data;

    } catch (error) {
        console.error("❌ Erreur réseau:", error);
        return { success: false, message: "Erreur réseau" };
    }
}

export async function getOrderOfTable(tableId) {

    try {
        const response = await fetch(`${serverUrl}/table/${Number(tableId)}/getOrders`);

        const data = await response.json();

        if (!data.success) {
            console.error("Erreur :", data.message);
        }
        return data.orders
    } catch (error) {
        console.error("Erreur réseau :", error);
    }
}

export async function getProduct(productId) {

    try {
        const response = await fetch(`${serverUrl}/product/${Number(productId)}`);

        const data = await response.json();
        return data
    } catch (error) {
        console.error("Erreur réseau :", error);
    }
}

export async function getFromSection(sectionId) {

    try {

        const response = await fetch(`${serverUrl}/section/${sectionId}`);

        const data = await response.json();
        return data
    } catch (error) {
        console.error("Erreur réseau :", error);
    }
}

export async function getPreviousSection(sectionId) {

    try {

        const response = await fetch(`${serverUrl}/section/previous/${sectionId}`);

        const data = await response.json();
        return data
    } catch (error) {
        console.error("Erreur réseau :", error);
    }
}

export async function getProductByName(research) {

    try {

        const response = await fetch(`${serverUrl}/product/byName/${research}`);

        const data = await response.json();
        console.log(data);
        return data
    } catch (error) {
        console.error("Erreur réseau :", error);
    }
}

export async function removeOrderById(orderId) {

    try {
        const response = await fetch(`${serverUrl}/order/remove/${orderId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });
        return response
    } catch (error) {
        console.error("Erreur réseau :", error);
    }
}

export async function changeStatusOfOrder(orderId, statusId, tableId, destinationId) {
    try {
        const response = await fetch(`${serverUrl}/order/changeOrderStatus/${orderId}/${statusId}/${tableId}/${destinationId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });
        return response
    } catch (error) {
        console.error("Erreur réseau :", error);
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

export async function changeStatusOfTable(tableId, statusId) {
    try {
        const response = await fetch(`${serverUrl}/table/${tableId}/status/${statusId}`, {
            method: "POST",
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

export async function getWorkerById(workerId) {
    return await callAPI(`worker/${workerId}`)
}

export async function connectToWebsite(login, password) {
    return await callAPI(`website/connect`, 'POST', { login, password })
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
