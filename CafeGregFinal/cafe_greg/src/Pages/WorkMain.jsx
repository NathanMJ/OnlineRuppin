import { useEffect, useState } from 'react'
import AskIdMsg from '../FComponents/AskIdMsg'
import ReturnButton from "../FComponents/ReturnButton"
import { useNavigate } from 'react-router-dom';
import { useIdContext } from '../Contexts/askIdContext';
import { getWorkerById } from '../connectToDB';

export default function WorkMain(props) {
    const [show, setShow] = useState(false);
    const [destination, setDestination] = useState('')
    const navigate = useNavigate()


    const { getWorkerId } = useIdContext();

    const gotAuthorization = (arrAuth, auth) => {
        if (!arrAuth)
            return
        return arrAuth.some(a => a.name == auth)
    }

    const goToWithId = async () => {
        //TO DO : check if the id exist in the db
        const id = await getWorkerId()

        const worker = await getWorkerById(id)
        console.log(worker);
        if (!worker) {
            setDestination('')
            return
        }



        switch (destination) {
            case 'service':
                navigate('/toggleService', { state: { id } })
                break;
            case 'bar':
                if (worker.isBarman) {
                    props.goto('/kitchenBarPreparation', { destinationId: 1 })
                }
                break;
            case 'kitchen':
                if (worker.isChef) {
                    props.goto('/kitchenBarPreparation', { destinationId: 0 })
                }
                break;
            case 'manager':
                alert("Manager side is not available yet")
                break;
        }
        setDestination('')

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
