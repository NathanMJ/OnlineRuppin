import { getFromTheSectionId, getPreviousIdSectionsById } from './db.js';

export default class Section{
    constructor(id) {
        this._id = id;
    }

    static async getBySection(sectionId, profile){
        return await getFromTheSectionId(sectionId, profile)
    }
    
    static async getPreviousSections(id){
        return await getPreviousIdSectionsById(id)
    }

}