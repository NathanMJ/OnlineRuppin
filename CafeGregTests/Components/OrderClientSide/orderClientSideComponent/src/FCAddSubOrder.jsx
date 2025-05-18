import React from 'react'
import addLogo from './Pictures/addLogo.png'
import subLogo from './Pictures/subLogo.png'

export default function FCAddSubOrder(props) {
let size = props.size;

return (
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <img style={{height: 5*size+'vw'}} src={props.addSub.status == '+' ? addLogo : props.addSub.status == '-' ? subLogo : 'https://img.freepik.com/premium-vector/simple-404-error-sign-concept-technical-fault-danger-notice-construction-page-http-response-code-isolated-white-background-flat-style-trend-modern-logo-design-vector-illustration_117142-142.jpg'}></img>
            <p style={{fontSize: 2*size+'vw'}}>{props.capitalizeFirstLetter(props.addSub.name)}</p>
            {props.addSub.price == null ? <p>Free</p> : <p>{props.addSub.price} ₪</p>}
        </div>
    )
}
