
export default function FCHistoryOrder(props) {
    return (
        <div className="order">
            <img src={props.order.img}/>                
            <h1>{props.order.name}</h1>
        </div>
    )
}
