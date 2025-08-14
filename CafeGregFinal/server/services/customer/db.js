import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { __dirname } from '../../globals.js';
import { MongoClient } from 'mongodb';




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
        //see if the id already exist 
        const exist = await db.collection('customers').findOne({ _id: customer._id })
        if (exist)
            throw new Error('Customer already exist')
        //add the customers to customers
        await db.collection('customers').insertOne(customer)
        //add the customers to the table
        await db.collection('tables').updateOne(
            { _id: tableId },
            { $push: { customers: Number(customer._id) } } // Force l'ID en int
        );
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