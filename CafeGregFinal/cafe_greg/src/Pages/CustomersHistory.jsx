import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import FCHistoryOrder from "../FComponents/FCHistoryOrder";

export default function CustomersHistory(props) {

    const location = useLocation()

    const { customers } = location.state

    //Customers filter is the id of the customer for filter
    const [customersFilter, setCustomersFilter] = useState(['345538268'])

    const [datesFilter, setDatesFilter] = useState({})
    const [orders, setOrders] = useState([{
        id: 10,
        img: './Pictures/Starters-section.jpg',
        name: "Meal's name"
    },{
        id: 10,
        img: './Pictures/Starters-section.jpg',
        name: "Meal's name"
    },{
        id: 10,
        img: './Pictures/Starters-section.jpg',
        name: "Meal's name"
    }, {
        id: 10,
        img: './Pictures/Starters-section.jpg',
        name: "Meal's name"
    }, {
        id: 10,
        img: './Pictures/Starters-section.jpg',
        name: "Meal's name"
    }, {
        id: 10,
        img: './Pictures/Starters-section.jpg',
        name: "Meal's name"
    }, {
        id: 10,
        img: './Pictures/Starters-section.jpg',
        name: "Meal's name"
    }, {
        id: 10,
        img: './Pictures/Starters-section.jpg',
        name: "Meal's name"
    }])

    useEffect(() => {
        console.log(datesFilter);
    }, [datesFilter])

    useEffect(() => {
        console.log(customersFilter);
    }, [customersFilter])


    /*TODO :
        SHOW HISTORY 
        CAN FILTER ACCORDING TO CUSTOMERS
            CAN SELECT MULTIPLY CUSTOMERS

*/

    const clickOnCustomer = (id) => {
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

    const selectionnedDateClass = (div) => {
        if (div == 2 && datesFilter.date2) {
            return true
        }
        if (datesFilter.date2)
            return false

        if (div == 1 && datesFilter.date1) {
            return true
        }
        if (datesFilter.date1)
            return false
        if (div == 0) {
            return true
        }
        return false
    }


    return (
        <div className="customerHistory">
            <div className="filterSide">
                <h1>Filters</h1>
                <div className="customers">
                    <h1 className="titleDetail">by customer</h1>
                    <div className="header">
                        <div className="notSelected">
                            <div className="square"></div>
                            Not selected
                        </div>
                        <div className="selected">
                            <div className="square"></div>
                            Not selected
                        </div>
                    </div>
                    {customers.map((customer, index) => (
                        <div className={`customer ${customersFilter.includes(customer.id) ? 'selected' : 'notSelected'}`} onClick={() => clickOnCustomer(customer.id)} key={index}>
                            <h1>{customer.name}</h1>
                        </div>
                    ))}
                </div>

                <div className="date">
                    <h1 className="titleDetail">by date</h1>
                    <div className={selectionnedDateClass(0) ? 'selectionedDate' : 'notSelectionedDate'}
                        onClick={() => setDatesFilter({})}>
                        without date
                    </div>
                    <h2>or</h2>
                    <div className={selectionnedDateClass(1) ? `selectionedDate` : 'notSelectionedDate'}>
                        On the day :
                        <input type="date" onChange={(e) => { setDatesFilter({ date1: e.target.value }) }} />
                    </div>
                    <h2>or</h2>
                    <div className={selectionnedDateClass(2) ? `selectionedDate` : 'notSelectionedDate'}>
                        <div >
                            Between the days :
                            <input type="date" onChange={(e) => setDatesFilter({
                                date1: e.target.value,
                                date2: datesFilter.date2 ? datesFilter.date2 : e.target.value
                            })} />
                        </div>
                        <div>
                            and
                            <input type="date" onChange={(e) => setDatesFilter({
                                date2: e.target.value,
                                date1: datesFilter.date1 ? datesFilter.date1 : e.target.value
                            })} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="historySide">
                <div className="header">
                    <h1>History</h1>
                    <h1>In common of : </h1>
                    <h1>At the date :</h1>
                </div>
                <div className="orders">
                    {orders.map((order, index) => (
                        <FCHistoryOrder key={index} order={order} />
                    ))}
                </div>
            </div>
        </div>
    )
}
