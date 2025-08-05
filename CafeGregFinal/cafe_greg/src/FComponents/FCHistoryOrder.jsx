
export default function FCHistoryOrder(props) {

    const goToOrderPage = (withChanges) => {
        //TODO : go to product page
        if (withChanges) {
            props.goto('/productPage', { productId: props.order.product_id, tableId: props.tableId });
        }
        else {
            props.goto('/productPage', { productId: props.order.product_id, tableId: props.tableId });
        }
    }

    //Here write the name of the customers dans there id next to

    return (
        <div className="order">
            <div className="head">
                <img src={props.order.img} />
                <h1>{props.order.name}</h1>
                <div className="buttons">
                    <h2 onClick={() => goToOrderPage(false)}>Go to the meal's page</h2>
                    <h3 onClick={() => goToOrderPage(true)}>Go to the page with same changements you did</h3>
                </div>
            </div>
            <div className="details">
                <h1>Ordered the : {new Date(props.order.date).toLocaleDateString('fr-FR')} with {props.order.customers.map((customer, index) => (
                    `${customer.name} (tz: ${customer.id})${index < props.order.customers.length - 1 ? ', ' : ''}`
                ))}
                </h1>
            </div>
        </div>
    )
}
