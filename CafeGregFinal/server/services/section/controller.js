import Section from "./model.js";

export async function getBySections(req, res) {
    const id = req.params.id
    //receive section or products
    let data = await Section.getBySections(id);

    if (!data) {
        return res.status(404).json({ message: "Nothing were found" });
    }
    return res.status(200).json(data);
}


export async function getPreviousSections(req, res) {
    const id = req.params.id
    let data = await Section.getPreviousSections(id);

    if (data === null || data === undefined) {
        return res.status(404).json({ message: "Nothing were found" });
    }
    return res.status(200).json(data);
}


