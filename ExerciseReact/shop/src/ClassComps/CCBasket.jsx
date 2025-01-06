import { Component } from 'react'
import CCItemBasket from './CCItemBasket';

export default class CCBasket extends Component {
    constructor(props) {
        super(props);
    }

  render() {
    return (
      <div><h1>My basket</h1>
      <div style={{display:'flex',flexDirection:'column',gap:"5px",width:'100%'}}>
        {this.props.items.map((item,index) => (
        !item.sale ? (
            <CCItemBasket key={index} name={item.name} price={item.price} sale={item.sale} index={index} removeFromTheBasket={this.props.removeFromTheBasket}/>
        ):null
      ))}</div>
      <h1>Total : {this.props.totalPrice} ₪</h1>
      </div>
    )
  }
}
