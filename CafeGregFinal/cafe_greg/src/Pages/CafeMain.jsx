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

    const clickOnTable = (id) => {
        props.goto(`/menu`, { tableId: id })
    }

    const openSetting = async () => {
        const id = await getWorkerId("Enter your ID:");
        if (id) {


            //TODO : check that the worker exist in the db 
            const exist = true

            if (exist) {
                //TODO : check that the worker is a waiter or a manager
                const status = 'waiter'
                setShowSettings({ show: true, isManager: status === 'manager' });
            }
        }

    }

    const addATable = () => {
        //Ask id, if id is waiter or manager continue
        const id = getWorkerId("Enter your ID:");
        alert('Open add table');
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
            <SettingsCafeMain isManager={showSettings.isManager} hideMsg={() => setShowSettings({ show: false, isManager: false })} show={showSettings.show}></SettingsCafeMain>
        </div>
    )
}
