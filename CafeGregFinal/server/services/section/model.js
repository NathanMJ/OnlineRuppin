import { getFromTheSectionId, getPreviousIdSectionsById } from './db.js';

export default class Section{
    constructor(id) {
        this._id = id;
    }

    static async getBySections(id){
        return await getFromTheSectionId(id)
    }
    
    static async getPreviousSections(id){
        return await getPreviousIdSectionsById(id)
    }

}