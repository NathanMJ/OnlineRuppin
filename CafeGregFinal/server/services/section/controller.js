import Section from "./model.js";

export async function getBySection(req, res) {
    const { sectionId, profile} = req.body
    //receive section or products
    const response = await Section.getBySection(sectionId, profile);

    if (!response.ok) {
        return res.status(404).json({ message: response.message });
    }
    return res.status(200).json(response);
}


export async function getPreviousSections(req, res) {
    const id = req.params.id
    let data = await Section.getPreviousSections(id);

    if (data === null || data === undefined) {
        return res.status(404).json({ message: "Nothing were found" });
    }
    return res.status(200).json(data);
}


