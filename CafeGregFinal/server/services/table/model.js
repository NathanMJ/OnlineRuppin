import { findAllTables, findTableById} from './db.js';

export default class Table{
    static async allTables(){
        return await findAllTables();
    }

    static async tableById(id){
        return await findTableById(id)
    }
}