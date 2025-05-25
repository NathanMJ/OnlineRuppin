//rexasin726@nomrista.com


const apiUrl = 'http://app-link.somee.com/api/';

export async function fetchTableIdFromServer(linkId) {
    try {
        const res = await fetch(`http://app-link.somee.com/api/Tables/tableId/1234`);
        if (!res.ok) throw new Error(`Erreur du serveur: ${res.status}`);

        const data = await res.json();        
        return data;
    } catch (error) {
        console.error("Erreur dans fetchTableIdFromServer:", error);
        throw error; // Pour remonter l'erreur
    }
}
