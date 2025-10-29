import { getFromTheSectionId, getPreviousIdSectionsByIdInDB } from './db.js';

export default class Section {
    constructor(id) {
        this._id = id;
    }

    static async getBySection(profile, sectionId) {
        return await getFromTheSectionId(profile, sectionId)
    }

    static async getPreviousSections(profile, sectionId) {
        return await getPreviousIdSectionsByIdInDB(profile, sectionId)
    }

}