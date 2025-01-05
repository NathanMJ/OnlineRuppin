import { Component } from 'react'
import CCItemsShop from './CCItemsShop.jsx'
import CCBasket from './CCBasket.jsx';
export default class CCShop extends Component {
    constructor() {
        super();
        this.state = {
            items: [{ name: "Hat", price: 22, sale: true }, { name: "T-Shirt", price: 62, sale: true }, { name: "Jeans", price: 54, sale: true }]
        }

    }

    setToBasket = (index) => {
        this.setState((prevS) => {
            const updatedItems = [...prevS.items]
            updatedItems[index].sale = false
            return { items: updatedItems }
        })
    }


    removeFromTheBasket = (index) => {
        this.setState((prevS) => {
            const updatedItems = [...prevS.items]
            updatedItems[index].sale = true
            return { items: updatedItems }
        })
    }

    render() {
        return (
            <div style={{display:'flex',flexDirection:'column',gap:'15px',backgroundColor:'gray',padding:'15px'}}>
                <h1>SHOP</h1>
                <div style={{ display: 'flex', flexDirection: 'rows', gap: 5 }}>
                    {this.state.items.map((item, index) =>
                        item.sale ? (
                            <CCItemsShop key={index} index={index} sendToBasket={this.setToBasket} name={item.name} price={item.price} sale={item.sale} />
                        ) : null)}
                </div>

                <CCBasket items={this.state.items} removeFromTheBasket={this.removeFromTheBasket}/>
            </div>
        )
    }
}
