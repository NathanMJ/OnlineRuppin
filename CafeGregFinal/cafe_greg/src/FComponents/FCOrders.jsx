import { useState, useEffect } from "react";
import { changeStatusOfOrder, removeOrderById } from "../connectToDB";

export default function FCOrders(props) {
    const [timers, setTimers] = useState([]);

    useEffect(() => {
        // Initialiser les timers pour chaque order avec la date
        setTimers(props.orders.map(order =>
            calculateTimeDiff(order.status?.time || new Date().toISOString())
        ));
    }, [props.orders]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimers(props.orders.map(order =>
                calculateTimeDiff(order.status?.time || new Date().toISOString())
            ));
        }, 1000);
        return () => clearInterval(interval);
    }, [props.orders]);

    const calculateTimeDiff = (dateString) => {
        const startDate = new Date(dateString);
        const now = new Date();
        const diffMs = Math.abs(now - startDate);

        const totalSeconds = Math.floor(diffMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const removeOrder = async (id) => {
        await removeOrderById(id);
        props.refreshOrders();
    };

    const confirmOrder = async (id, destination) => {
        await changeStatusOfOrder(id, 1, props.tableId, destination);
        props.refreshOrders();
    };

    const confirmReceivedOrder = async (id, destination) => {
        await changeStatusOfOrder(id, 5, props.tableId, destination);
        props.refreshOrders();
    }

    const capitalFirstLetter = (word) => {
        if (!word) return '';
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    };

    function showTime(time) {
        const [h, m, s] = time.split(':').map(Number);
        if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        return `${m}:${String(s).padStart(2, '0')}`;
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
                            <img onClick={() => confirmOrder(order._id, order.destination)} src='../Pictures/Confirmation.png' className="validate" />}
                        {order.status?.code === 4 &&
                            <img onClick={() => confirmReceivedOrder(order._id, order.destination)} src='../Pictures/Confirmation.png' className="validate" />}
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

                            {order.notesForChanges && order.notesForChanges.length > 0 && <h3>-- Notes for changes: --</h3>}
                            {order.notesForChanges && order.notesForChanges.map((note, idx) => (
                                <p key={idx}><b>{capitalFirstLetter([...order.changes, ...order.ingredients].find(ing => ing._id == note.ingredientId)?.name)}:</b> {note.note}</p>
                            ))}
                        </div>
                    </details>
                </div>
            ))}
        </div>
    );
}