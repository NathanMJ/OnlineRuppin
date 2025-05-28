export default function FCOrders(props) {
    return (
        <div className="orders">
            {props.orders.map((order, index) => {
                return (
                    <div className='order' key={index}>
                        <div className="mainOrder">
                            <img src={order.img} />
                            <h1>{order.name}</h1>
                            <h2>{order.price}</h2>
                        </div>
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
                    </div>
                )
            })}
        </div>
    )
}
