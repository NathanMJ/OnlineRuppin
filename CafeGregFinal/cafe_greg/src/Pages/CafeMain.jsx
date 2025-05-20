import { useState } from "react";
import AskIdMsg from "../FComponents/AskIdMsg";
import ReturnButton from "../FComponents/ReturnButton";

export default function CafeMain(props) {
    const [show, setShow] = useState(false);
    const tables = [
        { _id: 1, customers: [1, 2, 3], orders: [1, 2, 3, 4] },
        { _id: 2, customers: [1, 2, 3, 4] },
        { _id: 3, orders: [1, 2, 3, 4] },
        { _id: 4, customers: [1, 2, 3, 4], orders: [1, 2, 4], ask: 0 },
        { _id: 5, customers: [1, 2, 3, 4], ask: 0 }
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
                <div className="tables">
                    {tables.map((table) => {
                        return (
                            <div key={table._id} className="table">
                                <div className="customersCount">
                                    <p> {table.customers?.length > 0 ? table.customers.length : '0'} </p>
                                    <img src="/Pictures/Person-logo.png" alt="person-logo" className="personLogo" />
                                </div>

                                <div className="totalPrice">
                                    <p>Total : {table.orders ? getTotalOfTheTable(table._id) : 0} ₪</p>
                                </div>

                                <img src="/Pictures/Table.png" alt="table" className="tablePicture" />



                                <p className="tableId">{table._id}</p>
                                {table.lastCheck ? <div className="lastCheck"></div> : ""}
                            </div>
                        )
                    })}
                </div>
                <div className="options">
                    <img className="addTableLogo" src="/Pictures/Add-logo.png" />
                    <img className="private" src="/Pictures/Settings-logo.png" />
                </div>
                <ReturnButton bottom={'3vh'} left={'3vh'} returnButton={() => { props.goto('/sideChoice') }}></ReturnButton>
                <AskIdMsg showMsg={() => setShow(true)} hideMsg={() => setShow(false)} show={show}></AskIdMsg>
            </div>
        </div>
    )
}
