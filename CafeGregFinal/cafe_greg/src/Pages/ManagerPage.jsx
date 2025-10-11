import { useLocation } from "react-router-dom"
import ReturnButton from "../FComponents/ReturnButton"

export default function ManagerPage(props) {

    //TODO:
    /*
        change details in product : name, price, description
        see the workers and see if they are working and there history
            can switch them from working to not
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
                </div>
                <div className="productSide">
                    <h1>Product</h1>
                    <button onClick={() => { props.goto('/manager/products') }}>See the products</button>
                </div>
                <div className="statSide">
                    <h1>Stats</h1>
                    <button onClick={() => { props.goto('/manager/stats') }}>Production's times</button>
                </div>
            </div>
            <ReturnButton bottom={'10px'} left={'10px'}></ReturnButton>
        </div>
    )
}
