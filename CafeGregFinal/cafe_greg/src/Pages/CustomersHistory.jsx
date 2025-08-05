import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import FCHistoryOrder from "../FComponents/FCHistoryOrder";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import ReturnButton from "../FComponents/ReturnButton";

export default function CustomersHistory(props) {

    const location = useLocation()
    const navigate = useNavigate();


    const { customers, tableId } = location.state
    useEffect(() => {
        console.log('location', location.state);
    }, [tableId]);


    //Customers filter is the id of the customer for filter
    const [customersFilter, setCustomersFilter] = useState(['345538268'])

    const [datesFilter, setDatesFilter] = useState({})
    const [orders, setOrders] = useState([{
        product_id: 0,
        img: './Pictures/Starters-section.jpg',
        name: "Meal's name",
        date: '2023-10-01',
        customers: [{ name: 'Nathan', id: '345538268' }
            , { name: 'John', id: '123456789' },
        { name: 'Mick:', id: '234234234' }]
    }, {
        product_id: 1,
        img: './Pictures/Starters-section.jpg',
        name: "Meal's name",
        date: '2023-10-01',
        customers: [{ name: 'Nathan', id: '345538268' }]
    }, {
        product_id: 2,
        img: './Pictures/Starters-section.jpg',
        name: "Meal's name",
        date: '2023-10-01',
        customers: [{ name: 'Nathan', id: '345538268' }]
    }, {
        product_id: 3,
        img: './Pictures/Starters-section.jpg',
        name: "Meal's name",
        date: '2023-10-01',
        customers: [{ name: 'Nathan', id: '345538268' }]
    }, {
        product_id: 4,
        img: './Pictures/Starters-section.jpg',
        name: "Meal's name",
        date: '2023-10-01',
        customers: [{ name: 'Nathan', id: '345538268' }]
    }])

    useEffect(() => {
        console.log(datesFilter);
    }, [datesFilter])

    useEffect(() => {
        console.log(customersFilter);
    }, [customersFilter])


    /*
        TODO : CAN FILTER ACCORDING TO CUSTOMERS
        TODO : CAN FILTER ACCORDING TO MULTIPLY CUSTOMERS
        TODO : CAN FILTER ACCORDING TO DATES
        TODO : CAN FILTER ACCORDING TO TWO DATES
        TODO : REPLACE THE CALENDAR LOGO

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
                <div className="customersFilter">
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
                    <div className="customers">

                        {customers.map((customer, index) => (
                            <div className={`customer ${customersFilter.includes(customer.id) ? 'selected' : 'notSelected'}`} onClick={() => clickOnCustomer(customer.id)} key={index}>
                                <h1>{customer.name}</h1>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="datesFilter">
                    <div className={'noDate ' + (selectionnedDateClass(0) ? 'selectionedDate' : 'notSelectionedDate')}
                        onClick={() => setDatesFilter({})}>
                        <div className="container">
                            <h3 className="illusion3D">Without date</h3>
                            <h3>Without date</h3>
                        </div>
                    </div>
                    <h2>or</h2>
                    <div className={'uniqueDate ' + (selectionnedDateClass(1) ? `selectionedDate` : 'notSelectionedDate')}>
                        <h3 >On the day :</h3>
                        <div className="datepicker-wrapper">
                            <DatePicker
                                placeholderText="Select a date"
                                selected={datesFilter.date1}
                                dateFormat="dd/MM/yyyy"
                                onChange={(date) => setDatesFilter({ date1: date })}
                                className="datepicker-input-with-icon"
                            />
                            <div className="datepicker-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <h2>or</h2>
                    <div className={'twoDate ' + (selectionnedDateClass(2) ? `selectionedDate` : 'notSelectionedDate')}>
                        <div >
                            <h3>Between the days :</h3>
                            <div className="datepicker-wrapper">
                                <DatePicker
                                    value={datesFilter.date1 || null}
                                    maxDate={datesFilter.date2 || new Date().toISOString().split('T')[0]}
                                    placeholderText="Select a date"
                                    selected={datesFilter.date1}
                                    dateFormat="dd/MM/yyyy"
                                    onChange={(date) => {
                                        const nextDay = new Date(date);
                                        nextDay.setDate(nextDay.getDate() + 1);


                                        setDatesFilter({
                                            date1: date,
                                            date2: datesFilter.date2 ? datesFilter.date2 : nextDay
                                        });

                                    }}
                                    className="datepicker-input-with-icon"
                                />
                                <div className="datepicker-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                                </div>
                            </div>

                        </div>
                        <div>
                            <h3>and</h3>
                            <div className="datepicker-wrapper">
                                <DatePicker
                                    value={datesFilter.date2 || null}
                                    minDate={datesFilter.date1}
                                    maxDate={new Date()}
                                    placeholderText="Select a date"
                                    selected={datesFilter.date2}
                                    dateFormat="dd/MM/yyyy"
                                    onChange={(date) => {
                                        const beforeDay = new Date(date);
                                        beforeDay.setDate(beforeDay.getDate() - 1);
                                        setDatesFilter({
                                            date1: datesFilter.date1 ? datesFilter.date1 : beforeDay,
                                            date2: date
                                        });

                                    }}
                                    className="datepicker-input-with-icon"
                                />
                                <div className="datepicker-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="historySide">
                <div className="header">
                    <h1>History</h1>
                    {customersFilter?.length > 0 && <h2>In common of : {customersFilter.map((customer, index) => {
                        return (customers.find(c => c.id == customer).name + (index < customersFilter.length - 1 ? ', ' : ''))
                    })}</h2>}
                    {datesFilter.date1 && (
                        datesFilter.date2 ?
                            <h2>
                                Between the date {new Date(datesFilter.date1).toLocaleDateString('fr-FR')} and {new Date(datesFilter.date2).toLocaleDateString('fr-FR')}
                            </h2>
                            : <h2>
                                At the date {new Date(datesFilter.date1).toLocaleDateString('fr-FR')}
                            </h2>
                    )}

                    <ReturnButton top={'3vh'} right={'3vh'} returnButton={() => navigate(-1)}></ReturnButton>

                </div>
                <div className="orders">
                    {orders.map((order, index) => (
                        <FCHistoryOrder key={index} order={order} goto={props.goto} tableId={tableId} />
                    ))}
                </div>
            </div>
        </div>
    )
}
