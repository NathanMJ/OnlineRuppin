import { useState } from "react";
import FCOrdersPannel from "./FCOrdersPannel";

export default function FCTable(props) {

    const { table, clickOnTable, clickOnPlate } = props;

    //TODO: get logos from database

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
                        <img onClick={clickOnPlate} src="/Pictures/Plate.png" alt="plate-logo" className="plateLogo" />
                    </>
                }
                {table.status ? getAskLogo(table.status) : ''}


            </div>

            <div className="tablePictureContainer">
                <img src="/Pictures/Table.png" alt="table" className="tablePicture" onClick={() => clickOnTable(table._id)} />
                <div className="shadow"></div>
                <p className="tableId">{table._id}</p>
            </div>


        </div >
    )
}
