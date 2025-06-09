export async function fetchDB(url) {
    console.log(url);
    
    return fetch(url)
        .then((res) => {
            if (!res.ok) {
                throw new Error("Fetch error");
            }
            return res.json();
        })
        .catch((err) => {
            throw new Error(err.message);
        });
}