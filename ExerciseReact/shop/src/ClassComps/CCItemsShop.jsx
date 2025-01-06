import React, { Component } from 'react'

export default class CCItemsShop extends Component{
constructor(props) {
    super(props);
    
}
    
 setImg = () => {
        return `../src/Pictures/${this.props.name}.jpg`
    }



  render() {
    return (
        <div style={{width:'100%',display:'flex',flexDirection:'column',border:'rgb(175, 66, 166) solid 5px',borderRadius:'20px',backgroundColor:'rgb(225, 170, 230)',padding:'10px',gap:'20px'}}>
            <h2>{this.props.name}</h2>
            <img style={{width:250}} src={this.setImg()}></img>
            <h2>{this.props.price} ₪</h2>
            <button onClick={() => this.props.sendToBasket(this.props.index)}>Add to the basket</button>
        </div>
    )
  }
}

