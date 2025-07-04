import { useState, useEffect } from "react";

export default function FCOrders(props) {

    const removeOrder = (id) => {
        console.log('remove order ' + id);
    }

    const confirmOrder = (id) => {
        console.log('confirm order ' + id);
    }
    const useCountdown = (initialTime) => {
        const [time, setTime] = useState(initialTime);


        useEffect(() => {
            if (!time) return;
            const interval = setInterval(() => {
                setTime(prev => {
                    const [h, m, s] = prev.split(":").map(Number);
                    let totalSeconds = h * 3600 + m * 60 + s;
                    if (totalSeconds <= 0) {
                        clearInterval(interval);
                        return "00:00:00";
                    }
                    totalSeconds += 1;
                    const newH = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
                    const newM = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
                    const newS = String(totalSeconds % 60).padStart(2, "0");
                    return `${newH}:${newM}:${newS}`;
                });
            }, 1000);
            return () => clearInterval(interval);
        }, [time]);

        return time;
    }

    return (
        <div className="orders">
            {props.orders.map((order, index) => {
                const timer = useCountdown(order.timer || '13:10:00');
                return (
                    <div className='order' key={index}>
                        <div className="mainOrderContainer">
                            {order.status?.name === 'Pending' && <img onClick={() => removeOrder(order._id)} src='../Pictures/Cross.png' className="cross" />}
                            {order.status?.name === 'Pending' && <img onClick={() => confirmOrder(order._id)} src='../Pictures/Confirmation.png' className="validate" />}
                            <div className="mainOrder">
                                <div className="imageContainer">
                                    <img src={order.img} />
                                </div>

                                <div className="textContent">
                                    <h1>{order.name}</h1>
                                    <h2>{order.price}₪</h2>
                                </div>
                            </div>

                        </div>
                        <div className="statusContainer">
                            <h1 className="status"
                                style={{
                                    color: order.status?.color || 'black',
                                    backgroundColor: order.status?.backgroundColor || 'white'
                                }}

                            >{order.status?.name || 'TempStatus'}</h1>
                            {order.status?.name === 'Received' || order.status?.name === 'Pending' ||
                                <div className="timerContainer">
                                    <h1 className="header">Time last status change</h1>
                                    <h1 className="timer">{timer}</h1>
                                </div>}
                        </div>

                        <details className="detailsContainer">
                            <summary>See details</summary>
                            <div className="details">
                                {order.ingredients.map((ingredient, index) => {
                                    return (
                                        <p key={index}>{ingredient}</p>
                                    )
                                })}
                                {order.changes.map((change, index) => {
                                    return (
                                        <p key={index}>{change.change} {change.ingredient}</p>
                                    )
                                })}
                            </div>
                        </details>
                    </div>
                )
            })}
        </div>
    )
}
