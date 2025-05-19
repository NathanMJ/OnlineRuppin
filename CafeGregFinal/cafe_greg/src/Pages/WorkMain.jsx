import { useState } from 'react'
import AskIdMsg from '../FComponents/AskIdMsg'
import ReturnButton from "../FComponents/ReturnButton"
import { useNavigate } from 'react-router-dom';

export default function WorkMain(props) {
    const [show, setShow] = useState(false);
    const [destination, setDestination] = useState('')
    const navigate = useNavigate()

    const goToWithId = () => {
        switch(destination) {
            case 'service':                
                //TO DO : check if the id is valid  
                if(true){
                    navigate('/toggleService', {state : { id: '345538268'}})
                }else {

                }
                break;
            case 'bar':
                alert("Bar side is not available yet")
                break;
            case 'kitchen':
                alert("Kitchen side is not available yet")
                break;
            case 'manager':
                alert("Manager side is not available yet")
                break;        
        }
    }

    const receiveId = async (id) => {
        //TO DO : check the id in the database 
        // (existance and permission)


        return true;
    }

    const clickOnField = (field) => {
        setDestination(field)
        showMsg()
    }

    const showMsg = () => {
        setShow(true);
    }

    const hideMsg = () => {
        setShow(false);
    }
    return (
        <div className="workMain">            
        <div className="serviceSide"
            onClick={() => clickOnField('service')}>
                <h3>Enter/Stop service</h3></div>
            <div className="kitchenSide"
            onClick={() => clickOnField('kitchen')}>
                <h3>Kitchen side</h3></div>
            <div className="barSide"
            onClick={() => clickOnField('bar')}>
            <h3>Bar side</h3></div>
            <div className="managerSide"
            onClick={() => clickOnField('manager')}>
                <h3>Manager side</h3></div>
            <ReturnButton bottom={'3vh'} left={'3vh'}/>
            <AskIdMsg goToWithId={goToWithId} sendId={receiveId} showMsg={showMsg} hideMsg={hideMsg} show={show}></AskIdMsg>
        </div>
    )
}
