import Section from "./model.js";

export async function getBySection(req, res) {
    const { sectionId, profile } = req.body
    //receive section or products
    const response = await Section.getBySection(sectionId, profile);

    if (!response.ok) {
        return res.status(404).json({ message: response.message });
    }
    return res.status(200).json(response);
}


export async function getPreviousIdSectionsById(req, res) {
    const { sectionId, profile } = req.body
    console.log({sectionId, profile});
    
    let response = await Section.getPreviousSections(sectionId, profile);

    if (!response.ok) {
        return res.status(404).json({ message: response.message });
    }
    return res.status(200).json(response);
}


