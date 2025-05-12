import Customer from "./model.js";
import { ObjectId } from "mongodb";

export async function getAllCustomers(req, res) {
    //check permits 

    let customers = await Customer.allCustomer();

    if (!customers) {
        return res.status(404).json({ message: "No customers found" });
    }
    return res.status(200).json(customers);
}

export async function getCustomer(req, res) {
    //check permits     
    let customer = await Customer.findCustomer(req.params.id);

    if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
    }
    return res.status(200).json(customer);
}

export async function addCustomer(req, res) {

    let { id, contact, name} = req.body;
    const ogCustomer = new Customer(id, contact, name);

    if (!id) {
        return res.status(400).json({ message: "Id is missing" });
    }
    if (!contact) {
        return res.status(400).json({ message: "Contact can not be empty" });
    }
    if (!name) {
        return res.status(400).json({ message: "Name can not be empty" });
    }

    //check if the id already exist
    let customer = await Customer.findCustomer(id); 

        
    if (customer) {
        console.log("Customer already exist");
        
        return
        if(updatedCustomer.changes.length > 0)
            return res.status(200).json({ message: 'Customer successfully changed!', customer: updatedCustomer });
        else 
            return res.status(200).json({ message: 'No changes were made to the customer.' });
    } else {       
        const newCustomer = await Customer.addCustomer(ogCustomer);        
        return res.status(200).json({ message: 'Customer successfully added!', customer: newCustomer });
    }

}

export async function cleanCustomers(req, res) {
    const customers = await Customer.cleanCustomers()
    return res.status(200).json({ message: "Customers have been cleaned", customers })
}
