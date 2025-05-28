export default function FCOrders(props) {
    return (
        <div className="orders">
            {props.orders.map((order) => {
                return (
                    <div className='order'>
                        <div className="mainOrder">
                            <img src={order.img} />
                            <h1>{order.name}</h1>
                            <h2>{order.price}</h2>
                        </div>
                        <div className="details">
                            {order.ingredients.map((ingredient) => {
                                return (
                                    <p>{ingredient}</p>
                                )
                            })}
                            {order.changes.map((change) => {
                                return (
                                    <p>{change.change} {change.ingredient}</p>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
