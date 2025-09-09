import { log } from "node:console";
import Customer from "./model.js";

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

    let { id, contact, name } = req.body;

    if (!id) {
        return res.status(400).json({ message: "Id is missing" });
    }
    if (!contact) {
        return res.status(400).json({ message: "Contact can not be empty" });
    }
    if (!name) {
        return res.status(400).json({ message: "Name can not be empty" });
    }

    const ogCustomer = new Customer(id, contact, name);

    //check if the id already exist
    let customer = await Customer.findCustomer(id);


    if (customer) {
        return res.status(200).json({ message: 'Customer already exist', customer });
    } else {
        const newCustomer = await Customer.addCustomer(ogCustomer);
        return res.status(200).json({ message: 'Customer successfully added!', customer: newCustomer });
    }

}


export async function registerCustomer(req, res) {
    try {
        const { name, id, contact } = req.body;
        const customer = {
            name,
            _id: id,
            contact
        };
        const tableId = Number(req.params.tableId);
        const response = await Customer.register(tableId, customer);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export async function loginCustomer(req, res) {
    try {
        const { id } = req.body;
        const tableId = Number(req.params.tableId);
        const response = await Customer.login(tableId, id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export async function disconnectCustomer(req, res) {
    try {
        const { id } = req.body;
        const response = await Customer.disconnect(id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export async function getHistory(req, res) {
    try {
        const { customers, date1, date2 } = req.body;

        const response = await Customer.getHistory(customers, date1, date2);
        
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}



