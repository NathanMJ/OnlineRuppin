import { useState } from "react";
import AskIdMsg from "../FComponents/AskIdMsg";
import ReturnButton from "../FComponents/ReturnButton";

export default function CafeMain(props) {
    const [show, setShow] = useState(false);
    const tables = [
        { _id: 1, customers: [1, 2, 3], orders: [1, 2, 3, 4] },
        { _id: 2, customers: [1, 2, 3, 4] },
        { _id: 3, orders: [1, 2, 3, 4] },
        { _id: 4, customers: [1, 2, 3, 4], orders: [1, 2, 4], ask: 0 }
    ]

    const getTotalOfTheTable = (id) => {
        switch (id) {
            case 1:
                return 240;
            case 2:
                return 0;
            case 3:
                return 420;
            case 4:
                return 44;
        }
    }

    //  STATUS TABLE
    // ASK 0 => ASK FOR HELP 
    // ASK 1 => ASK TO PAY 

    return (
        <div className="cafeMain">
            <div className="leftSide"></div>
            <div className="tableSide">
                {tables.map((table) => {
                    return (
                        <div key={table._id} className="table">
                            <p className="tableId">{table._id}</p>
                            {table.customers ?
                                <div className="customersCount">
                                    <img src="/Pictres/CustomerLogo" alt="customerLogo" />
                                    <p>{table.customers.length}</p>
                                </div> : ''}
                            <img src="/Pictures/Table.png" alt="table" />
                            {table.orders ? <div className="totalPrice">
                                <p>Total : {getTotalOfTheTable(table._id)} ₪</p>
                            </div> : ''}

                            {table.lastCheck ? <div className="lastCheck"></div> : ""}
                        </div>
                    )
                })}

                <div className="addTableLogo">
                    ADD TABLE
                </div>
                <div className="Private">
                    PRIVATE
                </div>
                <ReturnButton bottom={'3vh'} left={'3vh'} returnButton={() => { props.goto('/sideChoice') }}></ReturnButton>
                <AskIdMsg showMsg={() => setShow(true)} hideMsg={() => setShow(false)} show={show}></AskIdMsg>
            </div>
        </div>
    )
}
