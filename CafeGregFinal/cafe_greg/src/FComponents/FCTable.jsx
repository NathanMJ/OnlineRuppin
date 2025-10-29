import { useState } from "react";

export default function FCTable(props) {

    const { table, clickOnTable, showOrdersIcon } = props;

    const setShowOrdersIcon = props.setShowOrdersIcon;


    //TODO: get logos from database

    const everyStatus = [
        { name: "pending", _id: 0 },
        { name: "ordered", _id: 1 },
        { name: "in preparation", _id: 2 },
        { name: "ready", _id: 3 },
        { name: "sended", _id: 4 },
        { name: "received", _id: 5 }
    ];

    const getAskLogo = (statusCode) => {
        //TODO: get the logo from the database/cloud

        //if no status code is here maybe think the status like thinking, waiting for order, etc...     
        switch (statusCode) {
            case 1:
                return <img className="statusLogo" src="/Pictures/Hand-up.png" />
            case 2:
                return <img className="statusLogo" src="/Pictures/Pay-logo.png" />
        }
    }

    return (
        <div key={table._id} className="table">
            <div className="header">
                {table.customers > 0 || table.orders?.length > 0 ?
                    < >
                        <p>{table.customers || 0}</p>
                        <img src="/Pictures/Person-logo.png" alt="person-logo" className="customerLogo" />
                    </> :
                    <p>Free</p>
                }
                {table.orders?.length > 0 &&
                    < >
                        <p>{table.orders.length}</p>
                        <img onClick={() => setShowOrdersIcon(true)} src="/Pictures/Plate.png" alt="plate-logo" className="plateLogo" />
                    </>
                }
                {table.status ? getAskLogo(table.status) : ''}

                {showOrdersIcon && table.orders?.length > 0 && <div className="orderIcons">
                    <img src="/Pictures/Cross.png" className="cross" onClick={() => setShowOrdersIcon(false)} />
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
                </div>}

            </div>

            <div className="tablePictureContainer">
                <img src="/Pictures/Table.png" alt="table" className="tablePicture" onClick={() => clickOnTable(table._id)} />
                <div className="shadow"></div>
                <p className="tableId">{table._id}</p>
            </div>
        </div >
    )
}
