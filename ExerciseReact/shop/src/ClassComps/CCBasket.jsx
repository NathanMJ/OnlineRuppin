import { Component } from 'react'
import CCItemBasket from './CCItemBasket';

export default class CCBasket extends Component {
    constructor(props) {
        super(props);
    }

  render() {
    return (
      <div style={{position:'fixed',top:'10px',right:'10px',color:'white',border:'rgb(255, 81, 0) solid 5px',backgroundColor:'orange',padding:'5px',borderRadius:'10px',width:'380px'}}>
        <h1>My basket</h1>
      <div style={{display:'flex',flexDirection:'column',gap:"5px",width:'100%', color:'black'}}>
        {this.props.items.map((item,index) => (
        !item.sale ? (
            <CCItemBasket key={index} name={item.name} price={item.price} sale={item.sale} index={index} removeFromTheBasket={this.props.removeFromTheBasket}/>
        ):null
      ))}</div>
      <h3>Total : {this.props.totalPrice} ₪</h3>
      </div>
    )
  }
}
