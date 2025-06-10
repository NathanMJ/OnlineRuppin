import { useState } from "react";

export default function FCSaucesProduct(props) {
    const maxAdd = 3;
    const eachAddPrice = 1
    const tempImage = 'https://www.emballagefute.com/1028-large_default/pots-a-sauce.jpg'

    const [showSauces, setShowSauces] = useState(false)

    const writePrice = (price, quantity) => {
        if (!price)
            price = 0
        const realPrice = calcAdd(quantity) + price
        console.log(realPrice);

        if (realPrice == 0) {
            return <h1 className="price">Free</h1> 
        }
        return <h1 className="price addPay">+ {realPrice} ₪</h1>
    }

    const clickOnAddASauce = () => {
        setShowSauces(!showSauces)
    }

    const clickOnASauce = (sauceId) => {
        props.addSauce(sauceId)
        setShowSauces(false)
    }

    const calcAdd = (quantity) => {
        if (quantity <= maxAdd)
            return 0
        let toMuch = Number(quantity) - maxAdd 
        console.log(toMuch);        
        return eachAddPrice * toMuch
    }

    return (
        <div className="saucesContainer">
            <h1 className="title">Sauces (max {maxAdd} each)</h1>
            <div className="buttonAddLogo" onClick={clickOnAddASauce}>
                <p className="content">Add sauces <span style={{fontWeight:600}}>+</span></p>
            </div>
            <div
                className="addableSauce"
                style={{
                    maxHeight: showSauces ? '50vh' : '0px',
                    transition: 'max-height 0.5s ease'
                }}
            >
                {props.sauces.map(sauce => (
                    <div className="sauce" key={sauce._id} onClick={() => clickOnASauce(sauce._id)}>
                        <div className="imageContainer">
                            <img src={tempImage} />
                        </div>
                        <h1 className="name">{sauce.name}</h1>
                    </div>
                ))}
            </div>
            <div className="sauces">
                {props.selectedSauces.map(sauceObj => {

                    //find the sauce in sauces
                    const sauce = props.sauces.find(searchSauce => searchSauce._id == sauceObj.id)

                    return <div className="sauce" key={sauce._id}>
                        <h1 className="name">{sauce.name}</h1>
                        <div className="imageContainer">
                            <img src={tempImage} />
                        </div>
                        <div className="counterSection">
                            <p onClick={() => props.changeQuantitySauce(sauce._id, '-')}>-</p>
                            <p className="quantity">{sauceObj.quantity}</p>
                            <p onClick={() => props.changeQuantitySauce(sauce._id, '+')}>+</p>
                        </div>
                        {writePrice(sauce.price, sauceObj.quantity)}
                    </div>
                })}
            </div>
        </div>
    )
}
