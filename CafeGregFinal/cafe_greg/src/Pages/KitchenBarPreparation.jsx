import React, { useEffect, useState } from 'react'
import FCTimer from '../FComponents/FCTimer';
import { changeStatusOfOrder, getOrdersFromDestionation } from '../connectToDB';
import { useLocation } from 'react-router-dom';
import ReturnButton from "../FComponents/ReturnButton";

export default function KitchenBarPreparation(props) {


    const location = useLocation();
    const destination = location.state.destinationId || 0;

    //In orders get every order in the order of the time and set them according to table


    const statusToChange = [
        { id: 1, name: 'Ordered' },
        { id: 2, name: 'In preparation' },
        { id: 3, name: 'Ready' },
        { id: 4, name: 'Sended' }
    ]

    const [statusContainer, setStatusContainer] = useState({
        orderId: 0
    })



    const [showPictureOfOrder, setShowPictureOfOrder] = useState([])

    const clickOnShowPicture = (orderId) => {
        if (showPictureOfOrder.some(o => o == orderId)) {
            const tempArr = showPictureOfOrder.filter(o => o != orderId)
            setShowPictureOfOrder(tempArr)
        }
        else {
            setShowPictureOfOrder([...showPictureOfOrder, orderId])
        }
    }

    const isThePictureShowing = (orderId) => {
        return showPictureOfOrder.some(o => o == orderId)
    }



    const [groupOfOrders, setGroupOfOrders] = useState([])

    const fetchTheOrders = async () => {
        const temp = await getOrdersFromDestionation(destination)
        setGroupOfOrders(temp.orders || [])
    }

    useEffect(() => {
        fetchTheOrders()
    }, [])


    const changeTheOrderStatus = async (orderId, newStatus) => {
        setStatusContainer({ orderId: undefined })

        await changeStatusOfOrder(orderId, newStatus.id)
        fetchTheOrders()
    }



    return (
        <div className='kitchenBarPreparationPage'>
            <ReturnButton right={'0px'} top={'0px'}></ReturnButton>
            <header>
                <p className='receiveTime'>Received time</p>
                <p className='preparationTime'>Cooked time</p>
                <p className='readyTime'>Ready time</p>
            </header>
            <div className='ordersSide'>
                {groupOfOrders.map((g, index) => {
                    return <div className='table' key={index}>
                        <p className='numberOfTheTable'>{g.tableId}</p>
                        <div className='orders'>
                            {g.orders.map(o => {
                                return <div className='order' key={o._id}>
                                    <div className='headerOrder' style={{
                                        flexDirection: isThePictureShowing(o._id) ? 'column' : 'row'
                                    }}>
                                        <p className='name'>{o.name}</p>
                                        <img className='pictureOfMeal'
                                            onClick={() => clickOnShowPicture(o._id)}

                                            style={{
                                                display: isThePictureShowing(o._id) ? 'block' : 'none'
                                            }} src={o.img} />
                                        <img className='pictureOfLogo'
                                            src="../Pictures/Camera-logo.png"
                                            onClick={() => clickOnShowPicture(o._id)}
                                            style={{
                                                display: isThePictureShowing(o._id) ? 'none' : 'block'
                                            }} />
                                    </div>
                                    <div className='ingredients'>
                                        {o.ingredients && <div className='base'>
                                            <h1>Base:</h1>
                                            {o.ingredients.map((i) => {
                                                return <p key={i._id}>{i.name}</p>
                                            })}
                                        </div>}

                                        {o.changes && o.changes.length > 0 && <div className='changes'>
                                            <h1>Changes:</h1>
                                            {o.changes.map((i) => {
                                                return <p key={i._id}>{i.change} {i.name}</p>
                                            })}
                                        </div>}

                                        {o.adds && <div className='adds'>
                                            <h1>Adds:</h1>
                                            {o.adds.map((i) => {
                                                return <p key={i._id}>{i.name}</p>
                                            })}
                                        </div>}

                                        {o.salad && <div className='salad'>
                                            <h1>Salad:</h1>
                                            <p>{o.salad.name}</p>
                                        </div>}
                                    </div>
                                    <div className='footer'>
                                        <div className='receiveTime timer'>{o.ordered_status_time && <FCTimer start={o.ordered_status_time}></FCTimer>}</div>
                                        {o.preparation_status_time && <div className='preparationTime timer'><FCTimer start={o.preparation_status_time}></FCTimer></div>}
                                        {o.ready_status_time && <div className='readyTime timer'><FCTimer start={o.ready_status_time}></FCTimer></div>}

                                        <div className='statusContainer'>
                                            <p className="status"
                                                onClick={() => setStatusContainer({ orderId: o._id == statusContainer.orderId ? null : o._id })}
                                                style={{
                                                    backgroundColor: o.status.background_color,
                                                    color: o.status.color
                                                }}>{o.status.status}</p>
                                            <div className='statusSelection' style={{
                                                display: statusContainer.orderId == o._id ? 'flex' : 'none'
                                            }}>
                                                {statusToChange.map((s, indexStatus) =>
                                                    (<p onClick={() => changeTheOrderStatus(o._id, s)} key={indexStatus}>{s.name}</p>)
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                })}
            </div>
        </div>
    )
}
