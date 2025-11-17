import { useEffect, useState } from "react";
import FCTimer from "./FCTimer";
import { changeStatusOfOrder, getOrderById, removeOrderById } from "../connectToDB";
import { useMessageContext } from "../Contexts/messageContext";
import { capitalFirstLetter } from "../usefullFunction";

export default function FCOrdersPannel(props) {

    const { orders, closePannel, ableToChange = false, profile, tableId } = props
    const { addMessage } = useMessageContext();

    const orderAreLoading = orders === undefined


    const everyStatus = [
        { name: "pending", _id: 0 },
        { name: "ordered", _id: 1 },
        { name: "in preparation", _id: 2 },
        { name: "ready", _id: 3 },
        { name: "sended", _id: 4 },
        { name: "received", _id: 5 }
    ];


    //TODO : set the order in real time

    /*TODO :
        change ingredients of orders
        change salad of orders
        changes adds of orders
    
    */

    const [idOrderSelected, setIdOrderSelected] = useState(0)
    const [switchSelected, setSwitchSelected] = useState(1)
    const [areYouSureBtn, setAreYouSureBtn] = useState(false)
    const [fullOrder, setFullOrder] = useState()
    const [changesOrder, setChangesOrder] = useState({ changes: [] })

    useEffect(() => {
        if (idOrderSelected === null) {
            setSwitchSelected(0)
            setAreYouSureBtn(false)
        }
    }, [idOrderSelected])

    useEffect(() => {
        const fetchFullOrder = async () => {
            const res = await getOrderById(profile, idOrderSelected, true)
            if (!res.ok) {
                addMessage(res.message, 'error', 5000)
            }
            setFullOrder(res.order)
        }

        if (profile && idOrderSelected !== null) {
            fetchFullOrder()
        }

    }, [profile, idOrderSelected])

    useEffect(() => {
        console.log(changesOrder);
    }, [changesOrder])



    const changeStatus = async (statusId) => {
        const order = orders?.find(o => o._id == idOrderSelected)
        const res = await changeStatusOfOrder(profile, order._id, statusId, tableId, order.destination)
        if (!res.ok) {
            addMessage(res.message, 'error', 5000)
        }
        addMessage("Status has been changed", 'success', 5000)
        setIdOrderSelected(null)
    }

    const cancelOrder = async () => {
        const res = await removeOrderById(profile, idOrderSelected)
        setIdOrderSelected(null)
        setAreYouSureBtn(false)
        if (!res.ok) {
            addMessage(res.message, 'error', 5000)
        }
        addMessage("Order has been removed", 'success', 5000)

    }

    //TODO: give a reduction price to a order


    if (orderAreLoading) {
        return <h1>loading</h1>
    }

    const clickOnChangeIngredient = (ingredientId, changeId) => {
        changeId = Number(changeId)
        //if the change is the original remove
        const isOriginalChange = fullOrder.changes.some(c => c._changeId === changeId && c.ingredientId === ingredientId)
        if(isOriginalChange){
            console.log('is in changes so remove');
            
        }
        //if not add it 
        console.log(changesOrder);

        setChangesOrder((prevS) => ({
            ...prevS,
            changes: {
                ...prevS.changes,
                [ingredientId]: changeId
            }
        }))
    }



    return (
        <div className="FCOrdersPannel">
            {idOrderSelected != null && <div className="changeOrderContainer">
                {/*TODO : change the order*/}
                <div className="switch">
                    <div className={`selectSwitch`} style={{ transform: `translateX(${100 * switchSelected}%)` }}></div>
                    <button className={`${switchSelected == 0 && 'selected'}`}
                        onClick={() => setSwitchSelected(0)}
                    >Status</button>
                    <button onClick={() => setSwitchSelected(1)}
                        className={`${switchSelected == 1 && 'selected'}`}>Order</button>
                    <button className={`${switchSelected == 2 && 'selected'}`}
                        onClick={() => setSwitchSelected(2)}
                    >Cancel</button>
                </div>

                <div className="changeOrder">
                    <img src="Pictures/Cross.png" className="cross"
                        onClick={() => setIdOrderSelected(null)} />
                    {(() => {
                        switch (switchSelected) {
                            case 0:
                                return <>
                                    <h1>Select the new status</h1>
                                    <div className="statusContainer">
                                        {everyStatus.map((status) => {
                                            const isCurrentStatus = orders?.find(o => o._id == idOrderSelected)?.status._id == status._id
                                            return <p key={status._id}
                                                style={{
                                                    backgroundColor: status.backgroundColor || 'white',
                                                    color: status.color || 'black'
                                                }}
                                                className={`statusOption ${isCurrentStatus ? 'selected' : ''}`}
                                                onClick={() => { !isCurrentStatus && changeStatus(status._id) }}>
                                                {capitalFirstLetter(status.name)}
                                            </p>
                                        })}
                                    </div>
                                </>;
                            case 1:
                                if (!fullOrder) {
                                    return <p>Loading</p>
                                }
                                console.log(fullOrder);
                                return <div className="changeContentOrder">
                                    <div className="header">
                                        <img src={fullOrder.img} />
                                        <div className="right">
                                            <h1>{fullOrder.name}</h1>
                                            <h2>Total : 40$</h2>
                                        </div>
                                    </div>
                                    <h1>Ingredients :</h1>
                                    <div className="ingredients">
                                        {fullOrder.ingredients.map(i => {
                                            let changeSelectedId = fullOrder.changes && fullOrder.changes.find(c => c.ingredientId == i._id)?.changeId
                                            //PAUSE HERE
                                            if (changeSelectedId === undefined) {
                                                changeSelectedId = i.changes.find(c => c._id === i.selected)._id
                                            }
                                            return <div key={i._id} className="ingredient">
                                                <select
                                                    onChange={(e) => clickOnChangeIngredient(i._id, e.target.value)}
                                                    defaultValue={changeSelectedId}>
                                                    {i.changes.map(c => {
                                                        return <option className="change"
                                                            value={c._id}
                                                            key={c._id}>{c.change}</option>
                                                    })}
                                                </select>
                                                <p className="ingredientName">{i.name}</p>
                                            </div>
                                        })}
                                        {fullOrder.productAdds && <>
                                            {fullOrder.productAdds.map(a => {
                                                return <div className={`add ${fullOrder.adds.find(a2 => a2._id == a._id) ? 'selected' : ''}`} key={a._id} >
                                                    <p className="name">{capitalFirstLetter(a.name)}</p>
                                                    <p className="price">{a.price}</p>
                                                </div>
                                            })}</>}
                                    </div>
                                    {
                                        fullOrder.productSalads && <>
                                            <h1>Salad :</h1>
                                            <div className="salads">{fullOrder.productSalads.map(s => {
                                                return <div key={s._id} className={`salad ${fullOrder.salad._id == s._id ? 'selected' : ''}`}>
                                                    <p>{s.name}</p>
                                                </div>
                                            })}</div>

                                        </>
                                        //TODO: ADD THE DETAILS OF THE SALAD HERE TOO
                                    }

                                </div>;
                            case 2:
                                return <>
                                    <h1>Remove the order</h1>
                                    <button onClick={() => setAreYouSureBtn(true)}>Yes</button>
                                    {areYouSureBtn && <>
                                        <h1>Confirm :</h1>
                                        <button onClick={() => cancelOrder()}>Yes</button></>}
                                </>;
                        }
                    })()}
                </div>
            </div>}

            {closePannel && <img src="Pictures/Cross.png" onClick={closePannel} className="cross" />}
            {
                orderAreLoading ? (<div className="loading">
                    <img src="Pictures/Loading.png" />
                    <h1>Loading</h1>
                </div>)
                    : (orders.length === 0 ?
                        <h1 style={{ fontSize: '40px' }}>No Orders found</h1> :
                        orders.map((order, index) => {
                            return <div key={order._id}
                                onClick={() => {
                                    if (ableToChange) {
                                        setIdOrderSelected(order._id)
                                    }
                                }}
                                className={`order ${index == orders.length - 1 && 'lastOrder'}`}>
                                <img src='Pictures/Loading.png' />
                                <p>{order.name}</p>
                                <div className="statusContainer">

                                    <p style={{
                                        backgroundColor: order.status.background_color,
                                        color: order.status.color
                                    }}>{capitalFirstLetter(order.status.name)}</p>

                                    <FCTimer start={order.status.time}></FCTimer>
                                </div>
                            </div>
                        }))
            }
        </div >
    )
}
