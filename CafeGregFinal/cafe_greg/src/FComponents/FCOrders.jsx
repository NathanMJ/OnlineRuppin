import { useState, useEffect } from "react";
import { changeStatusOfOrder, removeOrderById } from "../connectToDB";
export default function FCOrders(props) {
    const [timers, setTimers] = useState([]);

    useEffect(() => {
        // Initialiser les timers pour chaque order
        setTimers(props.orders.map(order => diffTime(order.status?.time || '00:00:00')));
    }, [props.orders]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimers(prevTimers =>
                prevTimers.map(t => {
                    const [h, m, s] = t.split(":").map(Number);
                    let totalSeconds = h * 3600 + m * 60 + s;
                    totalSeconds += 1;
                    const newH = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
                    const newM = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
                    const newS = String(totalSeconds % 60).padStart(2, "0");
                    return `${newH}:${newM}:${newS}`;
                })
            );
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const removeOrder = async (id) => {
        await removeOrderById(id);
        props.refreshOrders();
    };

    const confirmOrder = async (id) => {
        await changeStatusOfOrder(id, 1);
        props.refreshOrders();
    };

    const confirmReceivedOrder = async (id) => {
        await changeStatusOfOrder(id, 5);
        props.refreshOrders();
    }
    const capitalFirstLetter = (word) => {
        if (!word) return '';
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    };

    function diffTime(time1) {
        const toSeconds = (t) => {
            const [h, m, s] = t.split(':').map(Number);
            return h * 3600 + m * 60 + s;
        };
        const toHHMMSS = (sec) => {
            const h = Math.floor(sec / 3600);
            sec %= 3600;
            const m = Math.floor(sec / 60);
            const s = sec % 60;
            return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
        };
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        let diff = Math.abs(toSeconds(time1) - toSeconds(currentTime));
        return toHHMMSS(diff);
    }

    function showTime(time) {
        const [h, m, s] = time.split(':').map(Number);
        if (h > 0) return `${h}:${m}:${s}`;
        return `${m}:${s}`;
    }

    const writeTotalPrice = (order) => {
        let firstPrice = order.price
        //add the price of the adds if there is any
        if (order.adds && order.adds.length > 0) {
            order.adds.forEach(add => {
                firstPrice += add.price
            })
        }
        //add the price of the changes if there is any
        if (order.changes && order.changes.length > 0) {
            order.changes.forEach(ch => {
                firstPrice += ch.price
            })
        }
        //add the price of the salad if there is any
        if (order.salad) {
            firstPrice += order.salad.price
        }
        return firstPrice
    }

    const writeAddPrice = (price) => {
        if (price == 0) {
            return 'Free'
        }
        return '+' + price + ' ₪'
    }

    return (
        <div className="orders">
            {props.orders.map((order, index) => (
                <div className='order' key={order._id}>
                    <div className="mainOrderContainer">
                        {(order.status?.code === 0 || order.status?.code === 1) &&
                            <img onClick={() => removeOrder(order._id)} src='../Pictures/Cross.png' className="cross" />}
                        {order.status?.code === 0 &&
                            <img onClick={() => confirmOrder(order._id)} src='../Pictures/Confirmation.png' className="validate" />}
                        {order.status?.code === 4 &&
                            <img onClick={() => confirmReceivedOrder(order._id)} src='../Pictures/Confirmation.png' className="validate" />}
                        <div className="mainOrder">
                            <div className="imageContainer">
                                <img src={order.img} />
                            </div>
                            <div className="textContent">
                                <h1>{order.name}</h1>
                                <h2>{writeTotalPrice(order)}₪</h2>
                            </div>
                        </div>
                    </div>
                    <div className="statusContainer">
                        <h1 className="status"
                            style={{
                                color: order.status?.color || 'black',
                                backgroundColor: order.status?.background_color || 'white'
                            }}
                        >
                            {capitalFirstLetter(order.status?.status || 'tempStatus')}
                        </h1>
                        <div className="timerContainer">
                            <h1 className="header">Time last status change</h1>
                            <h1 className="timer">{showTime(timers[index] || '00:00:00')}</h1>
                        </div>
                    </div>
                    <details className="detailsContainer">
                        <summary>See details</summary>
                        <div className="details">
                            <p>{order.name} {order.price} ₪</p>
                            {order.ingredients.map((ingredient, idx) => (
                                <p key={idx}>{capitalFirstLetter(ingredient.name)}</p>
                            ))}
                            {order.salad && <p>{capitalFirstLetter(order.salad.name)} ({writeAddPrice(order.salad.price)})</p>}
                            {order.changes && order.changes.length > 0 && <h3>-- Changes: --</h3>}
                            {order.changes.map((change, idx) => (
                                <p key={idx}>{capitalFirstLetter(change.change)} {change.name} ({writeAddPrice(change.price)})</p>
                            ))}
                            {order.adds && order.adds.length > 0 && <h3>-- Adds: --</h3>}
                            {order.adds && order.adds.map((change, idx) => (
                                <p key={idx}>{capitalFirstLetter(change.change)} {change.name} ({writeAddPrice(change.price)})</p>
                            ))}
                        </div>
                    </details>
                </div>
            ))}
        </div>
    );
}
