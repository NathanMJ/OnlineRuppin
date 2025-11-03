import { useState } from "react";
import FCTimer from "./FCTimer";

export default function FCOrdersPannel(props) {


    const { orders, closePannel, ableToChange = false } = props

    const orderAreLoading = orders === undefined



    const everyStatus = [
        { name: "pending", _id: 0 },
        { name: "ordered", _id: 1 },
        { name: "in preparation", _id: 2 },
        { name: "ready", _id: 3 },
        { name: "sended", _id: 4 },
        { name: "received", _id: 5 }
    ];


    const capitalFirstLetter = (word) => {
        if (!word) return '';
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    };

    const [idChangeStatus, setIsChangeStatus] = useState(5)
    const [switchSelected, setSwitchSelected] = useState(0)

    //TODO: change a price to a order
    //TODO: change the status of a order
    //TODO: cancel an order

    return (
        <div className="FCOrdersPannel">
            {idChangeStatus && <div className="changeOrderContainer">
                {/*
                 TODO : change status
                        change the order
                        cancel the order */}
                <div className="switch">
                    <div className={`selectSwitch`} style={{ transform: `translateX(${100 * switchSelected}%)` }}></div>
                    <button className={`${switchSelected == 0 && 'selected'}`}
                        onClick={() => setSwitchSelected(0)}
                    >Status</button>
                    <button onClick={() => setSwitchSelected(1)}
                        className={`${switchSelected == 1 && 'selected'}`}>Order</button>
                    <button className={`${switchSelected == 2 && 'selected'}`}
                        onClick={() => setSwitchSelected(2)}
                    >Cancel</button>
                </div>

                <div className="changeOrder">
                        <img src="Pictures/Cross.png" className="cross"
                        onClick={() => setIsChangeStatus(null)}/>
                </div>
            </div>}

            {closePannel && <img src="Pictures/Cross.png" onClick={closePannel} className="cross" />}
            {orderAreLoading ? (<div className="loading">
                <img src="Pictures/Loading.png" />
                <h1>Loading</h1>
            </div>)
                : (orders.length === 0 ?
                    <h1>No Orders found</h1> :
                    orders.map((order, index) => {
                        return <div key={order._id} 
                        onClick={()=> setIsChangeStatus(order._id)}
                        className={`order ${index == orders.length - 1 && 'lastOrder'}`}>
                            <img src='Pictures/Loading.png' />
                            <p>{order.name}</p>
                            <div className="statusContainer">

                                <p style={{
                                    backgroundColor: order.status.background_color,
                                    color: order.status.color
                                }}>{capitalFirstLetter(order.status.name)}</p>

                                <FCTimer start={order.status.time}></FCTimer>
                            </div>
                        </div>
                    }))}
        </div>
    )
}
