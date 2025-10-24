import { getFromTheSectionId, getPreviousIdSectionsByIdInDB } from './db.js';

export default class Section{
    constructor(id) {
        this._id = id;
    }

    static async getBySection(sectionId, profile){
        return await getFromTheSectionId(sectionId, profile)
    }
    
    static async getPreviousSections(sectionId, profile){
        return await getPreviousIdSectionsByIdInDB(sectionId, profile)
    }

}