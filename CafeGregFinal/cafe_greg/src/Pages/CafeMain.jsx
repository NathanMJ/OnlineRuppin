import { useEffect, useState } from "react";
import ReturnButton from "../FComponents/ReturnButton";
import SettingsCafeMain from "../FComponents/SettingsCafeMain";
import { tempCafeTables } from "../tempDB";
import { useNavigate } from "react-router-dom";
import { fetchDB } from "../fetchDB";
import { useIdContext } from "../Contexts/askIdContext";


export default function CafeMain(props) {
    const [showSettings, setShowSettings] = useState({ show: false, isManager: false });

    const { getWorkerId } = useIdContext();

    const [clickOnTableMode, setClickOnTableMode] = useState('goto')

    const [tables, setTables] = useState([
        {
            _id: 1,
            customers: [123, 4]
        }
    ])



    useEffect(() => {
        const fetchData = async () => {
            return
            try {
                const resFetch = await fetchDB(`${fetchUrl}/table`);
                console.log(resFetch);
                setTables(resFetch); // si tu veux les stocker
            } catch (err) {
                console.error("Erreur lors du fetch :", err);
            }
        };

        fetchData();
    }, []);


    const getAskLogo = (askCode) => {
        switch (askCode) {
            case 0:
                return <img className="askLogo" src="/Pictures/Hand-up.png" />
            case 1:
                return <img className="askLogo" src="/Pictures/Pay-logo.png" />
        }
    }

    const changeTheStatusOfTheTable = (id) => {
        console.log('check table ', id);

    }

    const clickOnTable = (id) => {
        //TODO: make the real function of each one
        switch (clickOnTableMode) {
            case 'goto':
                // props.goto(`/menu`, { tableId: id })
                console.log('goto ', id);
                return
            case 'payment':
                openTip(240, id)
                break
            case 'switchTables':
                //TODO: switch two table already existing or switch the table of the table 
                console.log('switch the table ', id);
                break
            case 'removeATable':
                console.log('remove the table ', id);
                break
            case 'removeAnOrder':
                console.log('open the orders of table ', id);
                break
            case 'checkTable':
                changeTheStatusOfTheTable(id)
                break
            case 'reduction':
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
        const id = await getWorkerId("Enter your ID:");
        if (id) {
            //TODO : check that the worker exist in the db 
            const worker = true

            if (worker) {
                //TODO : check that the worker is a waiter or a manager
                const status = 'manager'
                setShowSettings({ show: true, isManager: status === 'manager' });
            }
        }

    }

    const addATable = () => {
        //Ask id, if id is waiter or manager continue
        const id = getWorkerId("Enter your ID:");
    }


    //Here concern the tip

    const [tip, setTip] = useState({
        show: false,
        value: 0,
        tablePrice: 0,
        tableId: 0
    })

    const [payment, setPayment] = useState({
        show: true,
        method: 'card'
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
            show: false
        }))
    }

    const confirmTip = () => {
        console.log('go to final pay');
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
    }

    //Simulate a payment by card

    useEffect(() => {

        if (payment && payment.method == 'card' && !payment.inUsed) {
            simulateCardPayment()
        }
    }, [payment])

    const simulateCardPayment = () => {
        setPayment((prevS) => ({ ...prevS, inUsed: true, message: "Hold your card near the reader." }))

        setTimeout(() => {
            setPayment((prevS) => ({ ...prevS, loading: true }))
        }, 2000)

        setTimeout(() => {
            setPayment((prevS) => ({ ...prevS,loading: false, message: "Payment accepted !" }))
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
                            {table.ask !== undefined ? getAskLogo(table.ask) : ''}
                        </div>
                    )
                })}
            </div>
            <div className="options">
                <img className="addTableLogo" src="/Pictures/Add-logo.png" onClick={addATable} />
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

            <ReturnButton bottom={'3vh'} left={'3vh'} returnButton={() => { props.goto('/sideChoice') }}></ReturnButton>
            <SettingsCafeMain clickOnSectionOfSettings={clickOnSectionOfSettings} isManager={showSettings.isManager} hideMsg={() => setShowSettings({ show: false, isManager: false })} show={showSettings.show}></SettingsCafeMain>
        </div>
    )
}
