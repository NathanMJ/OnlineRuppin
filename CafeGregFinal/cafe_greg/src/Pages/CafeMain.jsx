import { useEffect, useRef, useState } from "react";
import ReturnButton from "../FComponents/ReturnButton";
import SettingsCafeMain from "../FComponents/SettingsCafeMain";
import { useIdContext } from "../Contexts/askIdContext";
import { addTableById, changeStatusOfTable, deleteTableDB, getPriceOfTable, getTables, getWorkerById, payTableInDB, switchTables } from "../connectToDB.js"
import { useMessageContext } from "../Contexts/messageContext.jsx";
import { socket } from "../App.jsx";
import { use } from "react";

export default function CafeMain(props) {

    const { addMessage } = useMessageContext();

    const [showSettings, setShowSettings] = useState({ show: false, isManager: false });

    const { getWorkerId } = useIdContext();

    const [clickOnTableMode, setClickOnTableMode] = useState('goto')

    const [tables, setTables] = useState([]);
    const previousDataRef = useRef(null);

    const fetchAndCompare = async () => {
        try {
            const newData = await getTables();
                setTables(newData);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchAndCompare();

        //TODO :Ajouter un listener pour les mises a jour de commandes qui sont pretes (commande prete en cuisine/bar)

        socket.emit('subscribe:cafe-tables');

        const handleTablesUpdate = (data) => {
            //compare the data of each table and write a message if there is a change
            const tempNewTables = data.tables || []
            const tempOldTables = previousDataRef.current || []
            tempNewTables.forEach((newTable) => {                
                const oldTable = tempOldTables.find(t => t._id === newTable._id);
                console.log({ oldTable, newTable });
                
                if (oldTable && oldTable.status !== newTable.status) {
                    switch (newTable.status) {
                        case 1:
                            addMessage(`Table ${newTable._id} has requested service.`, "info", 5000);
                            break;
                        case 2:
                            addMessage(`Table ${newTable._id} has requested to pay.`, "info", 5000);
                            break;
                    }
                }
            })

            setTables(data.tables || [])
        };

        socket.on('cafe-tables:update', handleTablesUpdate);

        return () => {
            socket.emit('unsubscribe:cafe-tables');
            socket.off('cafe:tables:updated');
        };

    }, []);

    useEffect(() => {
        previousDataRef.current = tables;
    }, [tables]);


    const getAskLogo = (statusCode) => {
        //if no status code is here maybe think the status like thinking, waiting for order, etc...     
        switch (statusCode) {
            case 1:
                return <img className="askLogo" src="/Pictures/Hand-up.png" />
            case 2:
                return <img className="askLogo" src="/Pictures/Pay-logo.png" />
        }
    }

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
                props.goto(`/menu`, { tableId: id })
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
                fetchAndCompare()
                addMessage(`Tables have been switched`, "success", 5000)
                break
            case 'removeATable':
                await deleteTableDB(id)
                fetchAndCompare()
                break
            case 'removeAnOrder':
                console.log('open the orders of table ', id);
                break
            case 'checkTable':
                await changeStatusOfTable(id, 0)
                addMessage("The table has been checked", "success", 5000)

                fetchAndCompare()
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
        addMessage("Enter your ID to access settings", "info", 3000)
        const id = await getWorkerId("Enter your ID:");

        if (id) {
            const worker = await getWorkerById(id);

            const isManager = worker?.isManager || false;
            const isWaiter = worker?.isWaiter || false;

            if (isManager || isWaiter) {
                setShowSettings({ show: true, isManager });
            }
            else {
                addMessage("You are not authorized to access settings", "warning", 5000);
            }
        }
    };


    //Here concern the open a new table

    const [addTablePannel, setAddTablePannel] = useState({
        show: false,
        value: 1
    })

    const startOpenTable = async () => {
        //Ask id, if id is waiter or manager continue
        const id = await getWorkerId("Enter your ID:");
        //if id is correct set the value of the table to next value free
        //TODO: take the value from the database
        const nextValue = 1
        setAddTablePannel({ show: true, value: nextValue })
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
            console.log('table already exist');

        }
        setAddTablePannel({ show: false })

    }


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
        fetchAndCompare()
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
                            {table.status ? getAskLogo(table.status) : ''}
                        </div>
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
