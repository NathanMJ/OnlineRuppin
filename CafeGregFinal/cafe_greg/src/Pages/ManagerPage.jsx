import { useLocation } from "react-router-dom"
import ReturnButton from "../FComponents/ReturnButton"

export default function ManagerPage(props) {

    //TODO:
    /*
        change the autorizations of the workers
        send a message to every table
     */
    const location = useLocation()
    const { manager } = location.state

    return (
        <div className="managerPage">
            <h1>Hello {manager.name}</h1>
            <div className="options">
                <div className="workerSide">
                    <h1>Worker</h1>
                    <button onClick={() => { props.goto('/manager/workers', { manager }) }}>See the worker</button>
                    <button onClick={() => { props.goto('/manager/addWorkers', { manager }) }}>Add a worker</button>
                    <button onClick={() => { props.goto('/manager/changeAutorizations', { manager }) }}>Change autorizations</button>
                </div>
                <div className="productSide">
                    <h1>Products</h1>
                    <button onClick={() => { props.goto('/manager/products') }}>Changes products</button>
                </div>
                <div className="statSide">
                    <h1>Stats</h1>
                    <button onClick={() => { props.goto('/manager/stats') }}>Production's times</button>
                </div>
                <div className="tableSide">
                    <h1>Tables</h1>
                    <button onClick={() => { props.goto('/manager/sendMessageToTables') }}>Send them a message</button>
                </div>
            </div>
            <ReturnButton bottom={'10px'} left={'10px'}></ReturnButton>
        </div>
    )
}
