import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { __dirname } from '../../globals.js';
import { MongoClient } from 'mongodb';
import { getOrderById } from '../order/db.js';




export async function findAllCustomers() {
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);

        const db = client.db(process.env.DB_NAME);
        const customers = await db.collection("customers").find({}).toArray();
        return customers;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
    finally {
        if (client) {
            client.close();
        }
    }
}

export async function findCustomer(id) {
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);

        const db = client.db(process.env.DB_NAME);
        const customer = await db.collection("customers").findOne({ _id: id })
        return customer;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
    finally {
        if (client) {
            client.close();
        }
    }
}


export async function addCustomer(customer) {
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);
        const res = await db.collection("customers").insertOne(customer);
        return res;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
    finally {
        if (client) {
            client.close();
        }
    }
}


export async function modifyCustomer(customer) {
    let changes = []
    //find the customer in the list
    const customers = await findAllCustomers()
    const index = customers.findIndex(temp => temp.id == customer.id);

    //if original email is empty and the new got an email change it
    if (customer.email && customer.email != customers[index].email) {
        customers[index].email = customer.email
        changes.push('email')
    }

    //if original phone is empty and the new got a phone change it
    if (customer.phone && customer.phone != customers[index].phone) {
        customers[index].phone = customer.phone
        changes.push('phone')
    }
    await writeFile(path.join(__dirname, 'DB', 'customers.json'), JSON.stringify(customers, null, 2));

    return { customer, changes }
}

export async function registerInDB(tableId, customer) {
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);
        //see if the table exist 
        const table = await db.collection('tables').findOne({ _id: tableId })
        if (!table)
            throw new Error('Table not found')
        //see if the id already exist 
        const exist = await db.collection('customers').findOne({ _id: customer._id })
        if (exist)
            throw new Error('Customer already exist please login')
        const tables = await db.collection('tables').find({ customers: customer._id }).toArray()
        if (tables.length > 0)
            throw new Error('Customer already registered to a table')

        await db.collection('customers').insertOne(customer)
        //add the customers to the table
        await db.collection('tables').updateOne(
            { _id: tableId },
            { $push: { customers: customer._id } }
        );
        return { message: 'Customer successfully registered and added to table', customer };
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
    finally {
        if (client) {
            client.close();
        }
    }
}

export async function loginInDB(tableId, id) {
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);

        //see if the table exist
        const table = await db.collection('tables').findOne({ _id: tableId })
        if (!table)
            throw new Error('Table not found')
        //see if the customer exist
        const exist = await db.collection('customers').findOne({ _id: id })
        if (!exist)
            throw new Error('Customer not found please register')
        //see if the customer is already registered to a table
        const tables = await db.collection('tables').find({ customers: id }).toArray()
        if (tables.length > 0)
            throw new Error('Customer already registered to a table')
        //add the customer to the table
        await db.collection('tables').updateOne(
            { _id: tableId },
            { $push: { customers: id } }
        );


        return { message: 'Customer successfully logged and added to table' };
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
    finally {
        if (client) {
            client.close();
        }
    }
}


export async function disconnectInDB(id) {
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);

        //search of the customer is registered to a table
        const tables = await db.collection('tables').find({ customers: id }).toArray()
        if (tables.length === 0)
            throw new Error('Customer is not registered to any table')
        //remove the customer from the table
        await db.collection('tables').updateOne(
            { _id: tables[0]._id },
            { $pull: { customers: id } }
        );

        return { message: 'Customer successfully disconnected' };
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
    finally {
        if (client) {
            client.close();
        }
    }
}

export async function getHistoryFromDB(customers, date1, date2) {
    let client = null;
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);

        if (!customers || customers.length === 0) {
            return { orders: [] };
        }

        // Récupérer l'historique des commandes pour les clients
        let history = await db.collection('customers_order_history').find({ 
            customers: { $all: customers } 
        }).toArray();

        // Filtrage par date(s)
        if (date1 && !date2) {
            // Une seule date - filtrer pour ce jour exact
            const d1 = new Date(date1);
            
            if (isNaN(d1.getTime())) {
                console.error('Date invalide:', date1);
                return { orders: [] };
            }
            
            history = history.filter(order => {
                const orderDate = new Date(order.date);
                return orderDate.toDateString() === d1.toDateString();
            });
        }
        else if (date1 && date2) {
            // Deux dates - filtrer entre les deux (incluses)
            const d1 = new Date(date1);
            const d2 = new Date(date2);
            
            if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
                console.error('Date(s) invalide(s):', date1, date2);
                return { orders: [] };
            }
            
            // S'assurer que startDate <= endDate
            const startDate = d1 <= d2 ? d1 : d2;
            const endDate = d1 <= d2 ? d2 : d1;
            
            history = history.filter(order => {
                const orderDate = new Date(order.date);
                // ✅ Utiliser getTime() pour une comparaison correcte
                return orderDate.getTime() >= startDate.getTime() && 
                       orderDate.getTime() <= endDate.getTime();
            });
        }

        // Si aucune commande trouvée après filtrage
        if (history.length === 0) {
            return { orders: [] };
        }

        // Récupérer toutes les commandes détaillées
        let allOrders = [];
        
        for (const historyItem of history) {
            const tempOrders = historyItem.orders;
            try {
                const orders = await Promise.all(
                    tempOrders.map(async (orderId) => {
                        return await getOrderById(orderId);
                    })
                );
                // Aplatir directement dans allOrders
                allOrders.push(...orders);
            } catch (error) {
                console.error(`Erreur lors de la récupération des commandes pour ${historyItem._id}:`, error);
                // Continuer avec les autres items même si celui-ci échoue
            }
        }

        return { orders: allOrders };

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
    finally {
        if (client) {
            await client.close();
        }
    }
}
