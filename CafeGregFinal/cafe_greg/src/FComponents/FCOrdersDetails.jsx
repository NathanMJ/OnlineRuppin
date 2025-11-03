import { useEffect, useState } from "react";
import FCOrdersPannel from "./FCOrdersPannel";

export default function FCOrdersDetails(props) {
    const { table, close, changeAllowed = false } = props;

    const [shortDetails, setShortDetails] = useState(true)

    if (changeAllowed) {
        console.log('can change the status of the orders');

    }

    const everyStatus = [
        { name: "pending", _id: 0 },
        { name: "ordered", _id: 1 },
        { name: "in preparation", _id: 2 },
        { name: "ready", _id: 3 },
        { name: "sended", _id: 4 },
        { name: "received", _id: 5 }
    ];

    useEffect(() => {
        setShortDetails(true)
    }, [table]);



    return (
        table.orders?.length > 0 && <div className="FCOrdersDetails">
            <img src="/Pictures/Cross.png" className="cross" onClick={close} />
            <div className="switchContainer">
                <div className="switch" onClick={() => setShortDetails(!shortDetails)}>
                    <div className={`slider ${!shortDetails && 'slide-right'}`}></div>
                    <p className={`${shortDetails && 'selected'}`}>Icon</p>
                    <p className={`${!shortDetails && 'selected'}`}>Details</p>
                </div>
            </div>
            {shortDetails ?
                (<div className="ordersIcons">
                    {everyStatus.map((status) => {
                        //TODO: improve performance by calculation this outside of the return and by id 
                        const ordersWithThisStatus = table.orders.filter(order => order.status._id === status._id).length;
                        return (
                            <div className="countContainer" key={status._id}>
                                <div className="numberContainer">
                                    <p>{ordersWithThisStatus}</p>
                                </div>
                                <img key={status._id} src={`/Pictures/TableStatusIcon/${status.name.replace(' ', '_')}.png`} />
                            </div>
                        )
                    })}
                </div>) :
                <div className="ordersDetailsPannel">
                    <FCOrdersPannel show={true} orders={table.orders}
                    ></FCOrdersPannel>
                </div>}
        </div>
    )
}
