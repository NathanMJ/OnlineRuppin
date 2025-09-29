import { connectToWebsite} from './db.js';

export default class Website{
    constructor(id, contact, name) {
        this._id = id;
        this.contact = contact;
        this.name = name;
    }

    static async connect(login, password){
        return await connectToWebsite(login, password);
    }

    
}