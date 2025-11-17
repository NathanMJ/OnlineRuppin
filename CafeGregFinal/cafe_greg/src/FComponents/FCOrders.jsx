import { useState, useEffect } from "react";
import { changeStatusOfOrder, removeOrderById, workerEntry } from "../connectToDB";
import FCTimer from "./FCTimer";
import { capitalFirstLetter, filterIngredientsOfChanges } from "../usefullFunction";

export default function FCOrders(props) {
    const profile = props.profile

    const removeOrder = async (id) => {
        await removeOrderById(profile, id);
    };

    const confirmOrder = async (id, destination) => {
        await changeStatusOfOrder(profile, id, 1, props.tableId, destination);
    };

    const confirmReceivedOrder = async (id, destination) => {
        await changeStatusOfOrder(id, 5, props.tableId, destination);
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
            return ''
        }
        return '(+' + price + ' ₪)'
    }


    return (
        <div className="orders">
            {props.orders.map((order, index) => {
                const filteredIngredients = filterIngredientsOfChanges(order.ingredients, order.changes);

                return (



                    <div className='order' key={order._id}>
                        <div className="mainOrderContainer">
                            {(order.status?._id === 0 || order.status?._id === 1) &&
                                <img onClick={() => removeOrder(order._id)} src='../Pictures/Cross.png' className="cross" />}
                            {order.status?._id === 0 &&
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
                                }}>
                                {capitalFirstLetter(order.status?.name || 'tempStatus')}
                            </h1>
                            {order.status?._id !== 5 &&
                                <div className="timerContainer">
                                    <h1 className="header">Time last status change</h1>
                                    <FCTimer start={order.status.time}></FCTimer>
                                </div>}
                        </div>
                        <details className="detailsContainer">
                            <summary>See details</summary>
                            <div className="details">
                                <p>{order.name} {order.price} ₪</p>
                                {
                                    filteredIngredients?.length > 0 && <><h3>-- Ingredients: --</h3>
                                        {filteredIngredients.map((ingredient, idx) => (
                                            <p key={idx}>{capitalFirstLetter(`${ingredient.change.change} ${ingredient.name}`)}</p>
                                        ))}</>
                                }

                                {
                                    order.changes?.length > 0 && <>
                                        {order.changes.map((change, idx) => (
                                            <p key={idx}>{capitalFirstLetter(change.change)} {change.name} {writeAddPrice(change.price)}</p>
                                        ))}</>
                                }

                                {
                                    order.salad && <><h3>-- Salad: --</h3>
                                        <p>{capitalFirstLetter(order.salad.name)} {writeAddPrice(order.salad.price)}</p></>
                                }


                                {
                                    order.adds?.length > 0 && <> <h3>-- Adds: --</h3>
                                        {order.adds.map((change, idx) => (
                                            <p key={idx}>{capitalFirstLetter(change.name)} ({writeAddPrice(change.price)})</p>
                                        ))}</>
                                }

                                {/* {
                                    order.sauces?.length > 0 && <> <h3>-- Sauces: --</h3>
                                        {order.sauces.map((sauce, idx) => (
                                            <p key={idx}>{capitalFirstLetter(sauce.name)} x {sauce.quantity} ({writeAddPrice(sauce?.price || 0)})</p>
                                        ))}</>
                                } */}
                                {
                                    order.notesForChanges?.length > 0 && <><h3>-- Notes for changes: --</h3>
                                        {order.notesForChanges && order.notesForChanges.map((note, idx) => (
                                            <p key={idx}><b>{capitalFirstLetter([...(order.changes || []), ...(order.ingredients || [])].find(ing => ing._id == note.ingredientId)?.name)}:</b> {note.note}</p>
                                        ))}</>
                                }
                            </div>
                        </details>
                    </div>
                )
            })}
        </div>
    );
}