import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"

export default function CustomersHistory(props) {

    const location = useLocation()

    const { customers } = location.state

    //Customers filter is the id of the customer for filter
    const [customersFilter, setCustomersFilter] = useState([])

    useEffect(() => {
        console.log(customersFilter);
    }, [customersFilter])

    /*TODO :
        SHOW HISTORY 
        CAN FILTER ACCORDING TO CUSTOMERS
            CAN SELECT MULTIPLY CUSTOMERS

*/

    const checkACustomer = (id) => {
        console.log(id);

        const exist = customersFilter.some(eachId => eachId == id)

        if (exist) {
            let newCustomerFilter = customersFilter.filter(eachId => eachId != id)
            setCustomersFilter(newCustomerFilter)
        }
        else {
            let newCustomerFilter = [...customersFilter, id]
            setCustomersFilter(newCustomerFilter)
        }

    }


    return (
        <div className="customerHistory">
            <div className="filterSide">
                <div className="customers">
                    {customers.map((customer, index) => (
                        <div className="customer" onClick={() => checkACustomer(customer.id)} key={index}>
                            <div className="check"></div>
                            <h1>{customer.name}</h1>
                        </div>
                    ))}
                </div>
            </div>
            <div className="historySide">

            </div>
        </div>
    )
}
