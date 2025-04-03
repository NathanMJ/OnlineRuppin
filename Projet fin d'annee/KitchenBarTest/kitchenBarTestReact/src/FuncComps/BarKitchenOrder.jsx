import React from 'react'
import AddSubOrder from './AddSubOrder'


export default function BarKitchenOrder(props) {

const getAdd = () => {
    let tempKey = props.order.changes.adds.length;
    return props.order.changes.adds.map(add => 
    <AddSubOrder key={tempKey++} status='+' ingredient={add}></AddSubOrder>)
}
const getSub = () => {
    let tempKey = props.order.changes.subs.length;
    return props.order.changes.subs.map(sub => 
    <AddSubOrder key={tempKey++} status='-' ingredient={sub}></AddSubOrder>)
}

  return (
    <div className='barKitchenOrder'>
        <h1>{props.order.name}</h1>
        <img src={props.order.pictureLink} alt={props.order.pictureLink}/>
        {getAdd()}
        {getSub()}
    </div>
  )
}
