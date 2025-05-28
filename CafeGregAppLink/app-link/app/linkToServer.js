//rexasin726@nomrista.com


const apiUrl = 'http://app-link.somee.com/api/';

export async function fetchTableIdFromServer(linkId) {
    try {
        const res = await fetch(`${apiUrl}Tables/tableId/${linkId}`);
        if (!res.ok) throw new Error(`Erreur du serveur: ${res.status}`);

        const data = await res.json();        
        return data;
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
        throw error; // Pour remonter l'erreur
    }
}

export async function fetchProduct(tableId) {
    try {
        const res = await fetch(`${apiUrl}Orders/table/${tableId}`);
        if (!res.ok) throw new Error(`Erreur du serveur: ${res.status}`);

        const data = await res.json();        
        return data;
    } catch (error) {
        console.error("Erreur dans fetchOrderWithTableId:", error);
        throw error; // Pour remonter l'erreur
    }
}

