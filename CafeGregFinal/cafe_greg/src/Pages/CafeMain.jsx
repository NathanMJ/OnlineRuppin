import { useState } from "react";
import AskIdMsg from "../FComponents/AskIdMsg";
import ReturnButton from "../FComponents/ReturnButton";
import SettingsCafeMain from "../FComponents/SettingsCafeMain";

export default function CafeMain(props) {
    const [showAskId, setShowAskId] = useState(false);
    const [showSettings, setShowSettings] = useState(false)
    const [isManager, setIsManager] = useState(false)
    const tables = [
        { _id: 1, customers: [1, 2, 3], orders: [1, 2, 3, 4] },
        { _id: 2, customers: [1, 2, 3, 4], ask: 1 },
        { _id: 3, orders: [1, 2, 3, 4] },
        { _id: 4, customers: [1, 2, 3, 4], orders: [1, 2, 4] },
        { _id: 5, customers: [1, 2, 3, 4], ask: 0 }
    ]


    //  STATUS TABLE
    // ASK 0 => ASK FOR HELP 
    // ASK 1 => ASK TO PAY 

    const getAskLogo = (askCode) => {
        switch (askCode) {
            case 0:
                return <img className="askLogo" src="/Pictures/Hand-up.png" />
            case 1:
                return <img className="askLogo" src="/Pictures/Pay-logo.png" />
        }
    }

    const clickOnTable = (id) => {
        alert(`You clicked on the table ${id}`)

    }

    const openSetting = () => {
        setShowAskId(true)
    }

    const addATable = () => {
        //Ask id, if id is waiter or manager continue


    }

    const receiveId = async (id) => {

        //TO DO : check that the worker exist in the db 
        const exist = true

        if (exist) {
            //TO DO : check that the worker is a waiter or a manager
            const res = true
            if (res == 'waiter') {
                //if he is a waiter set half-autorization
                setIsManager(false)
            }
            else if (res == 'manager') {
                //if he is a manager set full autorization
                setIsManager(true)
            }
            setShowSettings(true)
            return true
        }
        return false
    }


    return (
        <div className="cafeMain">
            <div className="tables">
                {tables.map((table) => {
                    return (
                        <div key={table._id} className="table" onClick={() => clickOnTable(table._id)}>
                            <div className="customersCount">
                                <p> {table.customers?.length > 0 ? table.customers.length : '0'} </p>
                                <img src="/Pictures/Person-logo.png" alt="person-logo" className="personLogo" />
                            </div>

                            <img src="/Pictures/Table.png" alt="table" className="tablePicture" />

                            <div className="shadow"></div>
                            <p className="tableId">{table._id}</p>
                            {table.ask !== undefined ? getAskLogo(table.ask) : ''}
                        </div>
                    )
                })}
            </div>
            <div className="options">
                <img className="addTableLogo" src="/Pictures/Add-logo.png" onClick={addATable} />
                <img className="private" src="/Pictures/Settings-logo.png" onClick={openSetting} />
            </div>
            <ReturnButton bottom={'3vh'} left={'3vh'} returnButton={() => { props.goto('/sideChoice') }}></ReturnButton>
            <AskIdMsg exec={receiveId} showMsg={() => setShowAskId(true)} hideMsg={() => setShowAskId(false)} show={showAskId}></AskIdMsg>
            <SettingsCafeMain isManager={isManager} showMsg={() => setShowSettings(true)} hideMsg={() => setShowSettings(false)} show={showSettings}></SettingsCafeMain>
        </div>
    )
}
