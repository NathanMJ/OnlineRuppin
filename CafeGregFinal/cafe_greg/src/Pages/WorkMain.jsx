import { useEffect, useState } from 'react'
import AskIdMsg from '../FComponents/AskIdMsg'
import ReturnButton from "../FComponents/ReturnButton"
import { useNavigate } from 'react-router-dom';
import { useIdContext } from '../Contexts/askIdContext';
import { getWorkerById } from '../connectToDB';
import { useMessageContext } from '../Contexts/messageContext';

export default function WorkMain(props) {
    const [destination, setDestination] = useState('')

    const { addMessage } = useMessageContext();

    const { getWorkerId } = useIdContext();


    const goToWithId = async () => {
        const id = await getWorkerId()

        const worker = await getWorkerById(id)
        console.log('worker is ', worker);

        if (!worker) {
            setDestination('')
            addMessage("No worker found", "error", 5000)
            return
        }



        switch (destination) {
            case 'service':
                props.goto('/toggleService', { worker })
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
                if (worker.isManager) {
                    props.goto('/manager', { manager: worker })
                }
                else 
                    addMessage('You are not allowed.', 'error', 5000)
                break;
        }
        setDestination('')

    }

    useEffect(() => {
        if (destination != '') {
            goToWithId()
        }
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
