import Table from "./model.js";

export async function getAllTables(req, res) {
    let tables = await Table.allTables();
    if (!tables) {
        return res.status(404).json({ message: "No tables found" });
    }
    return res.status(200).json(tables);
}


export async function getTable(req, res) {
    let table = await Table.tableById(Number(req.params.id));
    if (!table) {
        return res.status(404).json({ message: "No table found" });
    }
    return res.status(200).json(table);
}
