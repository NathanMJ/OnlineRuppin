import { Component } from 'react'
import CCItemsShop from './CCItemsShop.jsx'
import CCBasket from './CCBasket.jsx';
export default class CCShop extends Component {
    constructor() {
        super();
        this.state = {
            totalPrice:0,
            items: [{ name: "Hat", price: 22, sale: true }, { name: "T-Shirt", price: 62, sale: true }, { name: "Jeans", price: 54, sale: true }]
        }

    }

    setToBasket = (index) => {
        this.setState((prevS) => {
            const updatedItems = [...prevS.items]
            updatedItems[index].sale = false
            const newTotalPrice = prevS.totalPrice + updatedItems[index].price
            return { items: updatedItems, totalPrice: newTotalPrice}
        })
    }


    removeFromTheBasket = (index) => {
        this.setState((prevS) => {
            const updatedItems = [...prevS.items]
            updatedItems[index].sale = true
            const newTotalPrice = prevS.totalPrice - updatedItems[index].price
            return { items: updatedItems, totalPrice: newTotalPrice}
        })
    }

    render() {
        const saleItemsCount = this.state.items.filter(item => item.sale === true).length;

        return (
            <div style={{display:'flex',flexDirection:'column',gap:'15px',backgroundColor:'cyan',border:'blue solid 5px',borderRadius:'20px',padding:'15px'}}>
                <h1>SHOP</h1>
                <div style={{ display: 'flex', flexDirection: 'rows', gap: 5 }}>
                    {
                    saleItemsCount != 0?(
                        this.state.items.map((item, index) =>
                            item.sale ? (
                                <CCItemsShop key={index} index={index} sendToBasket={this.setToBasket} name={item.name} price={item.price} sale={item.sale} />
                            ) : null)
                    ): <h2>The shop is empty</h2>}
                </div>

                <CCBasket items={this.state.items} removeFromTheBasket={this.removeFromTheBasket} totalPrice={this.state.totalPrice}/>
            </div>
        )
    }
}
