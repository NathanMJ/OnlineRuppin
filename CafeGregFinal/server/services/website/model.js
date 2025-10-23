import { addTokenInDB, connectToWebsite, getTokenInDB,removeTokenInDB} from './db.js';

export default class Website{
    constructor(id, contact, name) {
        this._id = id;
        this.contact = contact;
        this.name = name;
    }

    static async connect(login, password, token){
        return await connectToWebsite(login, password, token);
    }
    static async addToken(profile, token){
        return await addTokenInDB(profile, token);
    }

    static async getToken(profile, token){
        return await getTokenInDB(profile, token);
    }  
    static async removeToken(profile, token){
        return await removeTokenInDB(profile, token);
    }    
    
}