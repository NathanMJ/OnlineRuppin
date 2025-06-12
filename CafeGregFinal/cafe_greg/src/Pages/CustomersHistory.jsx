import { useLocation } from "react-router-dom"

export default function CustomersHistory(props) {

    const location = useLocation()

    const { customers } = location.state

    console.log(location.state);
    
    /*TODO :
        SHOW HISTORY 
        CAN FILTER ACCORDING TO CUSTOMERS
            CAN SELECT MULTIPLY CUSTOMERS

*/
    return (
        <div className="customerHistory">
            <div className="filterSide">
                <div className="customers">
                    {customers.map((customer, index) => (
                        <div className="customer" key={index}>
                            <h1>{customer.name}</h1>
                        </div>
                    ))}
                </div>
            </div>
            <div className="orderSide">

            </div>
        </div>
    )
}
