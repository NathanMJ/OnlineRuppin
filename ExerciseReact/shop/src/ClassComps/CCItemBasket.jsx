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
      <div style={{padding:'3px',margin:'5px',border:'black solid 3px',borderRadius:'5px',backgroundColor:'white',display:'grid',gridTemplateColumns:'2fr 1fr 1fr 2fr',gap:'15px',alignItems:'center',justifyContent:'center',alignContent:'center'}} >
        <h4>{this.props.name}</h4>
        <img style={{width:75}} src={this.setImg()}></img>
        <h4>{this.props.price} ₪</h4>
        <button type="button" className="btn btn-outline-danger" onClick={() => this.props.removeFromTheBasket(this.props.index)}>Remove</button>

      </div>
    )
  }
}
