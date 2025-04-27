import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { __dirname } from '../../globals.js';

export async function findAllCustomers() {
    let customers = await readFile(path.join(__dirname, 'DB', 'customers.json'));
    return JSON.parse(customers.toString());
}

export async function findCustomer(id) {
    let customers = await readFile(path.join(__dirname, 'DB', 'customers.json'));
    customers = JSON.parse(customers.toString());
    let customer = customers.find((customer) => customer.id === id);
    return customer;
}

export async function addCustomer(customer) {
    let customers = await findAllCustomers();
    customers.push(customer);
    await writeFile(path.join(__dirname, 'DB', 'customers.json'), JSON.stringify(customers, null, 2));
    return customer;
}

export async function cleanCustomers() {
    let customers = await findAllCustomers();
    //clean every customer that doesnt fit to the criteria 

    /* Criteria :
            email has to be right (regex)
            phone has to be right (regex)
            id (tz) has to be right (regex)
     */


    customers = customers.filter(customer => isCorrectCustomer(customer));
    customers = removeDuplicates(customers)

    await writeFile(path.join(__dirname, 'DB', 'customers.json'), JSON.stringify(customers, null, 2));
    return customers
}

function isCorrectCustomer(customer) {
    let { id, email, phone } = customer
    //if the id is empty or the email/phone is empty return false
    
    if (!id || (!email && !phone)) {        
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^0\d{9}$/;
    const idRegex = /^\d{9}$/;

    if(email && !emailRegex.test(email))
        return false

    if(phone && !phoneRegex.test(phone))
        return false

    if(!idRegex.test(id)){
        return false
    }
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