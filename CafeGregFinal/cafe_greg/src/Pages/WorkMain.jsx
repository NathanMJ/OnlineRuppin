import { useState } from 'react'
import AskIdMsg from '../assets/FComponents/AskIdMsg'
import ReturnButton from "../assets/FComponents/ReturnButton"

export default function WorkMain() {
    const [show, setShow] = useState(false);

    const receiveId = async (id) => {
        //TO DO : check the id in the database 
        // (existance and permission)


        return false;
    }

    const showMsg = () => {
        setShow(true);
    }

    const hideMsg = () => {
        setShow(false);
    }
    return (
        <div className="workMain">
            <div 
            className="serviceSide"
            onClick={showMsg}
            ><h3>Enter/Stop service</h3></div>
            <div className="kitchenSide"
            onClick={showMsg}><h3>Kitchen side</h3></div>
            <div className="barSide"
            onClick={showMsg}><h3>Bar side</h3></div>
            <div className="managerSide"
            onClick={showMsg}><h3>Manager side</h3></div>
            <ReturnButton bottom={'3vh'} left={'3vh'}/>
            <AskIdMsg sendId={receiveId} showMsg={showMsg} hideMsg={hideMsg} show={show}></AskIdMsg>
        </div>
    )
}
