import { Component } from 'react'

export default class CCItemBasket extends Component {
  constructor(props) {
    super(props);
    
  }

  
 setImg = () => {
    return `../src/Pictures/${this.props.name}.jpg`
}

    render() {
    return (
      <div style={{width:'350px',backgroundColor:'green',display:'flex',gap:'15px',alignItems:'center',justifyContent:'center',alignContent:'center'}} >
        <h4>{this.props.name}</h4>
        <img style={{width:75}} src={this.setImg()}></img>
        <h4>{this.props.price} ₪</h4>
        <button type="button" className="btn btn-outline-danger" onClick={() => this.props.removeFromTheBasket(this.props.index)}>Remove</button>

      </div>
    )
  }
}
