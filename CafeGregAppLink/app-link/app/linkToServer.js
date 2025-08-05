//rexasin726@nomrista.com


const apiUrl = 'http://app-link.somee.com/api/';

export async function fetchTableIdFromServer(linkId) {
    try {
        const res = await fetch(`${apiUrl}Tables/tableId/${linkId}`);
        if (!res.ok) throw new Error(`Erreur du serveur: ${res.status}`);

        const tableId = await res.json();
        return tableId;
    } catch (error) {
        return
    }
}

export async function fetchOrdersWithTableId(tableId) {
    try {
        const res = await fetch(`${apiUrl}Orders/table/${tableId}`);
        if (!res.ok) throw new Error(`Erreur du serveur: ${res.status}`);

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Erreur dans fetchOrderWithTableId:", error);
        throw error;
    }
}


export async function fetchCustomerByTableId(tableId) {
  try {
    const res = await fetch(`${apiUrl}Customers/table/${tableId}`);

    if (res.status === 204) {
      // Aucun client trouvé → on retourne une liste vide
      return [];
    }

    if (!res.ok) {
      throw new Error(`Erreur du serveur: ${res.status}`);
    }

    const data = await res.json();
    return data;
    
  } catch (error) {
    console.error("Erreur dans fetchCustomerByTableId:", error);
    return []; // On retourne une liste vide même en cas d'erreur réseau
  }
}


export async function servRegisterCustomer(customer, tableId) {
    try {
        const response = await fetch(`${apiUrl}Customers/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: customer.id,
                contact: customer.contact,
                firstName: customer.name,
                tableId: tableId
            })
        });

        if (!response.ok) {
            const errorText = await response.text(); // pour lire le message d’erreur SQL
            throw new Error(errorText);
        }

        const data = await response.json();
        return data

    } catch (error) {
        alert(error.message); // pour afficher à l'utilisateur si besoin
    }
}


export async function servLoginCustomer(customerId, tableId) {

    try {
        const response = await fetch(`${apiUrl}Customers/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: customerId,
                tableId: tableId
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const data = await response.json();
        return data

    } catch (error) {
        alert(error.message);
    }
}

export async function fetchSections() {
    try {
        const res = await fetch(`${apiUrl}Sections/total-sections`);
        if (!res.ok) throw new Error(`Erreur du serveur: ${res.status}`);

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Erreur dans fetchSections:", error);
        throw error;
    }
}

export async function servOrderProductById(productId, tableId) {
    console.log("Données envoyées au fetch :", { productId, tableId });

    try {
        const response = await fetch(`${apiUrl}Orders/order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId: productId,
                tableId: tableId
            })
        });

        const responseText = await response.text();
        console.log("Texte brut de la réponse :", responseText);

        if (!response.ok) {
            throw new Error(responseText);
        }
        try {
            const data = JSON.parse(responseText);
            return data;
        } catch (e) {
            console.warn("Pas de JSON à parser ou erreur de parsing.");
            return responseText;
        }

    } catch (error) {
        alert(error.message);
    }
}

export async function servChangeOrderStatus(orderId, newStatus) {
    console.log(orderId, newStatus);

    try {
        const response = await fetch(`${apiUrl}Orders/change-status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                orderId: orderId,
                newStatus: newStatus
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const data = await response.json();
        return data

    } catch (error) {
        alert(error.message);
    }
}

export async function servCancelOrder(orderId) {
    console.log(orderId);

    try {
        const response = await fetch(`${apiUrl}Orders/cancel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                orderId: orderId
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const data = await response.json();
        return data

    } catch (error) {
        alert(error.message);
    }
}


export async function fetchProductsThatContains(searchText) {
    try {
        const response = await fetch(`${apiUrl}Products/search?searchText=${encodeURIComponent(searchText)}`);

        if (response.status === 204) {
            // Aucun résultat, on renvoie simplement une liste vide
            return [];
        }

        if (!response.ok) {
            throw new Error(`Erreur serveur: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Erreur lors de la recherche des produits :", error.message);
        return []; // <- On retourne aussi une liste vide en cas d’erreur
    }
}


export async function sercDisconnectCustomer(customerId) {
    console.log(customerId);
    
    await fetch(`${apiUrl}Customers/disconnect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: customerId })
    });

}