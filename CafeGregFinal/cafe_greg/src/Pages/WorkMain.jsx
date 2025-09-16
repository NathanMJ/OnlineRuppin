import { useEffect, useState } from 'react'
import AskIdMsg from '../FComponents/AskIdMsg'
import ReturnButton from "../FComponents/ReturnButton"
import { useNavigate } from 'react-router-dom';
import { useIdContext } from '../Contexts/askIdContext';

export default function WorkMain(props) {
    const [show, setShow] = useState(false);
    const [destination, setDestination] = useState('')
    const navigate = useNavigate()


    const { getWorkerId } = useIdContext();



    const goToWithId = async () => {

        setDestination('')
        //TO DO : check if the id exist in the db
        const id = await getWorkerId()


        //TO DO : check if the id got the autorization to go to the space
        switch (destination) {
            case 'service':
                if (true) {
                    navigate('/toggleService', { state: { id: '345538268' } })
                } else {

                }
                break;
            case 'bar':
                alert("Bar side is not available yet")
                break;
            case 'kitchen':
                props.goto('/kitchenBarPreparation')
                break;
            case 'manager':
                alert("Manager side is not available yet")
                break;
        }
    }

    useEffect(() => {
        if (destination != '') {
            goToWithId()
        }
        console.log(destination);

    }, [destination])

    const clickOnField = (field) => {
        setDestination(field)
    }


    const returnButton = () => {
        props.goto('/sideChoice')
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
            <ReturnButton returnButton={returnButton} bottom={'3vh'} left={'3vh'} />
        </div>
    )
}
