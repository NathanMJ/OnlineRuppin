import { useEffect, useRef, useState } from "react";
import ReturnButton from "../FComponents/ReturnButton";
import SettingsCafeMain from "../FComponents/SettingsCafeMain";
import { useIdContext } from "../Contexts/askIdContext";
import {
    addTableById, changeStatusOfTable, deleteTableDB,
    getPriceOfTable, getTables, getWorkerByIdFromDB, payTableInDB, switchTables
} from "../connectToDB.js"
import { useMessageContext } from "../Contexts/messageContext.jsx";
import { socket } from "../App.jsx";
import FCTable from "../FComponents/FCTable.jsx";
import FCOrdersPannel from "../FComponents/FCOrdersPannel.jsx";
import FCOrdersDetails from "../FComponents/FCOrdersDetails.jsx";

export default function CafeMain(props) {

    //TODO: set payment in an another FC
    //TODO: set settings in an another FC

    const { addMessage } = useMessageContext();
    const storeAccess = props.storeAccess
    const profile = storeAccess?.profile || null


    const destinations = [
        { name: "kitchen", _id: 0 },
        { name: "bar", _id: 1 },
    ]


    const [showSettings, setShowSettings] = useState({ show: false, isManager: false });

    const { getWorkerById } = useIdContext();

    const [clickOnTableMode, setClickOnTableMode] = useState('goto')

    const [tables, setTables] = useState([]);
    const previousDataRef = useRef(null);


    useEffect(() => {

        const fetchTables = async () => {
            const response = await getTables(profile);

            if (response.ok) {
                setTables(response.tables)
            }
        };

        if (profile) {
            fetchTables();

            socket.emit('subscribe:main-tables', profile);

            const handleTablesUpdate = (data) => {
                //compare the data of each table and write a message if there is a change
                const tempNewTables = data.tables || []
                const tempOldTables = previousDataRef.current || []
                tempNewTables.forEach((newTable) => {
                    const oldTable = tempOldTables.find(t => t._id === newTable._id);
                    //check if the status of the table changed
                    if (oldTable && oldTable.status !== newTable.status) {
                        switch (newTable.status) {
                            case 0:
                                if (oldTable.status === 1) {
                                    addMessage(`Table ${newTable._id} status has been checked.`, "success", 5000);
                                }
                                break;
                            case 1:
                                addMessage(`Table ${newTable._id} has requested service.`, "info", 5000);
                                break;
                            case 2:
                                addMessage(`Table ${newTable._id} has requested to pay.`, "info", 5000);
                                break;
                        }
                    }

                    //check the status of each order of the table and write a message if a order is ready
                    newTable.orders?.forEach((newOrder) => {
                        const oldOrder = oldTable ? oldTable.orders.find(o => o._id === newOrder._id) : null;
                        if (oldOrder && oldOrder.status._id !== newOrder.status._id) {
                            if (newOrder.status._id === 3) {
                                addMessage(`An order for table ${newTable._id} is ready in the ${destinations.find(d => d._id == newOrder.destination).name}.`, "info", 5000);
                                //TODO: add sound of ringing bell
                                //TODO: be able of disabling this message/sound in settings
                                //TODO: be able of change the sound in settings
                            }
                        }
                    });
                })

                setTables(tempNewTables)
            };
            socket.on(`main-tables:update`, handleTablesUpdate);

            return () => {
                socket.emit('subscribe:main-tables', profile);
                socket.off(`main-tables:update`, handleTablesUpdate);
            };
        }

    }, [profile]);

    useEffect(() => {
        previousDataRef.current = tables;
    }, [tables]);



    const [tableSwitch, setTableSwitch] = useState()

    useEffect(() => {
        //set a message according to the mode
        switch (clickOnTableMode) {
            case 'switchTables':
                addMessage("Select the first table to switch with", "info", 5000)
                break
            case 'switchTable2':
                addMessage("Select the second table to switch with", "info", 5000)
                break
            case 'removeATable':
                addMessage("Select the table to remove", "info", 5000)
                break
            case 'removeAnOrder':
                break
            case 'checkTable':
                addMessage("Click on the table to check", "info", 5000)
                break
            case 'reduction':
                break
        }
    }, [clickOnTableMode])


    const clickOnTable = async (id) => {
        //TODO: make the real function of each one
        switch (clickOnTableMode) {
            case 'goto':
                //WORK
                props.goto(`/menu`, { tableId: id })
                return
            case 'checkTable':
                changeStatusOfTable(profile, id, 0)
                break
            case 'detailsOrders':
                setTableIdShowOrdersPannel(id)
                return

            case 'payment':
                //get the total price of the table from the db
                const totalPrice = await getPriceOfTable(id)
                console.log('total price of the table ', totalPrice);
                openTip(totalPrice, id)
                break
            case 'switchTables':
                setTableSwitch(id)
                setClickOnTableMode("switchTable2")
                return
            case 'switchTable2':
                await switchTables(tableSwitch, id)
                addMessage(`Tables have been switched`, "success", 5000)
                break
            case 'removeATable':
                await deleteTableDB(id)
                break
            case 'removeAnOrder':
                console.log('open the orders of table ', id);
                break
            case 'reduction':
                //TODO: make a reduction on the total price of the table
                console.log('reduct the table ', id);
                break
        }
        setClickOnTableMode('goto')
    }


    const clickOnSectionOfSettings = (section) => {
        switch (section) {
            case 'history':
                console.log('see history of the day');
                return
        }
        setClickOnTableMode(section)
    }


    const openSetting = async () => {
        try {
            const res = await getWorkerById(profile, "Enter your ID:");
            if (!res.ok) {
                addMessage(res.message, "error", 5000);
                return;
            }
            const worker = res.worker;
            const isManager = worker?.isManager || false;
            const isWaiter = worker?.isWaiter || false;

            if (isManager || isWaiter) {
                setShowSettings({ show: true, isManager });
            }
            else {
                addMessage("You are not authorized to access settings", "warning", 5000);
            }
        }
        catch (error) {
            console.log(error);
        }
    };


    //TODO: set in a Functionnal component
    //Here concern the open a new table

    const [addTablePannel, setAddTablePannel] = useState({
        show: false,
        value: 1
    })

    const startOpenTable = async () => {
        try {
            const res = await getWorkerById(profile, "Enter your ID:");
            if (!res.ok) {
                addMessage(res.message, "error", 5000);
                return;
            }
            const worker = res.worker;
            const isManager = worker?.isManager || false;
            const isWaiter = worker?.isWaiter || false;

            if (isManager || isWaiter) {
                //TODO : get the next id available for a table
                const nextValue = 1
                setAddTablePannel({ show: true, value: nextValue })
            }
            else {
                addMessage("You are not authorized to open a new table", "warning", 5000);
            }
        }
        catch (error) {
            console.log(error);
        }
    }


    const addTable = async () => {
        const exist = false
        if (!exist) {
            //create the table and go to the page with the id of the table

            const result = await addTableById(Number(addTablePannel.value));
            if (!result.success) {
                alert(result.message);
                return
            }
            else {
                //go to the page
                props.goto(`/menu`, { tableId: addTablePannel.value })
                return
            }
        }
        else {
            addMessage('table already exist', 'error', 5000);
        }
        setAddTablePannel({ show: false })

    }


    //TODO: set in a functionnal component

    //Here concern the tip/payment

    const [tip, setTip] = useState({
        show: false,
        value: 0,
        type: '%',
        tablePrice: 0,
        tableId: 0
    })

    const [payment, setPayment] = useState({
        show: false
    })

    const openTip = (tablePrice, tableId) => {
        setTip({
            show: true,
            type: '%',
            value: 0,
            tablePrice,
            tableId
        })
    }

    const presetTip = (value, type) => {
        setTip((prevS) => ({ ...prevS, value: value, type: type }))
    }

    const cancelTip = () => {
        setTip((prevS) => ({
            ...prevS,
            show: false,
        }))
    }

    const confirmTip = () => {
        cancelTip()
        setPayment({ show: true })
    }

    const calcTheFinalPrice = () => {
        if (tip.type == '%') {
            return Math.round((tip.tablePrice + (tip.value / 100 * tip.tablePrice)) * 10) / 10
        }
        else if (tip.type == '₪') {
            return Number(tip.tablePrice) + Number(tip.value)
        }
        return 0
    }

    const openTheCashRegister = () => {
        setPayment({ show: false })
        setTableToPaid()
    }

    //Simulate a payment by card

    useEffect(() => {
        if (payment && payment.method == 'card' && !payment.inUsed) {
            simulateCardPayment()
        }
    }, [payment])


    const setTableToPaid = async () => {
        //get the value of the tip according to the tip state
        let tipValue = 0
        if (tip.type == '%') {
            tipValue = Math.round((tip.value / 100 * tip.tablePrice) * 10) / 10
        }
        else if (tip.type == '₪') {
            tipValue = Number(tip.value)
        }
        await payTableInDB(tip.tableId, tipValue)
    }

    const simulateCardPayment = () => {
        setPayment((prevS) => ({ ...prevS, inUsed: true, message: "Hold your card near the reader." }))

        setTimeout(() => {
            setPayment((prevS) => ({ ...prevS, loading: true }))
        }, 2000)

        setTimeout(() => {
            setPayment((prevS) => ({ ...prevS, loading: false, message: "Payment accepted !" }))
            setTableToPaid()
        }, 4000)

        setTimeout(() => {
            setPayment({ show: false })
        }, 6000)
    }



    const [tableIdShowOrdersDetails, setTableIdShowOrdersDetails] = useState(null);
    const [tableIdShowOrdersPannel, setTableIdShowOrdersPannel] = useState(55)

    //TODO: if a pannel is opened, close the others one

    useEffect(() => {


    }, [tableIdShowOrdersDetails])


    return (
        <div className="cafeMain">
            {tableIdShowOrdersDetails !== null && <FCOrdersDetails
                table={tables.find(t => t._id == tableIdShowOrdersDetails)}
                close={() => setTableIdShowOrdersDetails(null)}
                showOrdersDetails={tableIdShowOrdersDetails !== null} />}

            {tableIdShowOrdersPannel !== null && 
            <div className="FCOrdersPannelContainer"><FCOrdersPannel
                changeAllowed={true}
                closePannel={() => setTableIdShowOrdersPannel(null)}
                orders={tableIdShowOrdersPannel ?
                    tables.find(t => t._id == tableIdShowOrdersPannel)?.orders : null
                } />
                </div>}

            <div className="tables">
                {tables.map((table) => {
                    return (<FCTable key={table._id}
                        table={table}
                        clickOnTable={clickOnTable}
                        clickOnPlate={() => {
                            setTableIdShowOrdersDetails(table._id === tableIdShowOrdersPannel
                                ? null : table._id)
                        }}></FCTable>
                    )
                })}
            </div>
            <div className="options">
                <img className="addTableLogo" src="/Pictures/Add-logo.png" onClick={startOpenTable} />
                <img className="private" src="/Pictures/Settings-logo.png" onClick={openSetting} />
            </div>

            <div className="tipContainer" style={{ display: tip.show ? 'flex' : 'none' }}>
                <p className="title">Add a tip</p>
                <p className="total">Total = {tip.tablePrice} ₪</p>
                <div className="changeValueContainer">
                    <p>+</p>
                    <input type="number" value={tip.value} onChange={(e) => setTip((prevS) => {
                        let newValue = e.target.value.replace(/^0+/, '')
                        return ({ ...prevS, value: newValue == '' ? '0' : newValue })
                    }
                    )} />
                    <div className="typeTipContainer">
                        <button onClick={() => setTip((prevS) => ({ ...prevS, type: '₪' }))} className={`${tip.type == '₪' && 'isSelected'}`}>₪</button>
                        <button onClick={() => setTip((prevS) => ({ ...prevS, type: '%' }))} className={`${tip.type == '%' && 'isSelected'}`}>%</button>
                    </div>
                </div>
                <div className="presetTip">
                    <p onClick={() => presetTip(10, '%')}>10%</p>
                    <p onClick={() => presetTip(20, '%')}>20%</p>
                    <p onClick={() => presetTip(25, '%')}>25%</p>
                    <p onClick={() => presetTip(10, '₪')}>10₪</p>
                </div>
                <p className="total">Total = {calcTheFinalPrice()} ₪</p>
                <div className="bottomButtons">
                    <button onClick={confirmTip} className="confirm">Confirm</button>
                    <button onClick={cancelTip} className="cancel">Cancel</button>
                </div>
            </div>


            <div className="choosePaymentMethod" style={{ display: (payment.show && !payment.method ? 'block' : 'none') }}>
                <h1>Choose the payment :</h1>
                <div>
                    <h1 onClick={() => setPayment((prevS) => ({ ...prevS, method: 'cash' }))}>Cash</h1>
                    <h1 onClick={() => setPayment((prevS) => ({ ...prevS, method: 'card' }))}>Card</h1>
                </div>
            </div>

            <div className="finalPayment" style={{ display: payment.show && payment.method ? 'block' : 'none' }}>
                {payment.method == 'cash' ?
                    <p className="click" onClick={openTheCashRegister}>Open the cash register</p>
                    :
                    payment.method == 'card' ?
                        payment.loading ?
                            <div>
                                <div><img src="/Pictures/Loading.png" alt="loading" /></div>
                                <p>Loading...</p>
                            </div>
                            :
                            <div>
                                <p>{payment.message}</p>
                            </div>
                        : <p>Error</p>
                }
            </div>

            <div className="addTable" style={{ display: addTablePannel.show ? 'flex' : 'none' }}>
                <h1>Add a table</h1>
                <div className="container">
                    <div className="tableSide">
                        <img src="/Pictures/Table.png" className="table" />
                        <p className="tableId">{addTablePannel.value}</p>
                    </div>
                    <div className="inputSide">
                        <p>The table's id :</p>
                        <input type="number" min={0} value={addTablePannel.value ^ 0} onChange={(e) => setAddTablePannel((prevS) => ({ ...prevS, value: e.target.value }))} placeholder="The id" />
                    </div>
                </div>
                <button onClick={addTable}>Add the table</button>
                <img className="cross" src="/Pictures/Cross.png" onClick={() => setAddTablePannel({ show: false })} />
            </div>

            <ReturnButton bottom={'3vh'} left={'3vh'} returnButton={() => { props.goto('/sideChoice') }}></ReturnButton>
            <SettingsCafeMain clickOnSectionOfSettings={clickOnSectionOfSettings} isManager={showSettings.isManager} hideMsg={() => setShowSettings({ show: false, isManager: false })} show={showSettings.show}></SettingsCafeMain>
        </div>
    )
}
