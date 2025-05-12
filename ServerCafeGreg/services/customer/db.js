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
    }   catch (error){
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
    finally {
        if(client){
            client.close();
        }
    }
}

export async function findCustomer(id) {
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        
        const db = client.db(process.env.DB_NAME); 
        const customer = await db.collection("customers").findOne({_id: id})        
        return customer;       
    }   catch (error){
        console.error('Error connecting to MongoDB:', error);        
        throw error;
    }
    finally {
        if(client){
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
    }   catch (error){
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
    finally {
        if(client){
            client.close();
        }
    }
}

export async function cleanCustomers() {
    let customers = await findAllCustomers();
    //clean every customer that doesnt fit to the criteria 

    /* Criteria :
            id (tz) has to be right (regex)
            name has to exist
            contact has to exist (email or phone)
     */


    customers = customers.filter(customer => isCorrectCustomer(customer));
    customers = removeDuplicates(customers)

    await writeFile(path.join(__dirname, 'DB', 'customers.json'), JSON.stringify(customers, null, 2));
    return customers
}

function isCorrectCustomer(customer) {
    let { id, contact, name } = customer
    //if the id is empty or the email/phone is empty return false
    
    if (!id || !name || !contact) {        
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^0\d{9}$/;
    const idRegex = /^\d{9}$/;

    if(!emailRegex.test(email) || !phoneRegex.test(phone))
        return false

    if(!idRegex.test(id))
        return false
    
    return true
}

function removeDuplicates (customers) {
    const seen = new Set();
    return customers.filter(customer => {
      if (seen.has(customer.id)) {
        return false;
      } else {
        seen.add(customer.id);
        return true;
      }
    });
  };
  
export async function modifyCustomer(customer){
    let changes = []
    //find the customer in the list
    const customers = await findAllCustomers()
    const index = customers.findIndex(temp => temp.id == customer.id);
    
    //if original email is empty and the new got an email change it
    if(customer.email && customer.email != customers[index].email){
        customers[index].email = customer.email
        changes.push('email')
    }

    //if original phone is empty and the new got a phone change it
    if(customer.phone && customer.phone != customers[index].phone){
        customers[index].phone = customer.phone
        changes.push('phone')
    }
    await writeFile(path.join(__dirname, 'DB', 'customers.json'), JSON.stringify(customers, null, 2));

    return {customer, changes}
}