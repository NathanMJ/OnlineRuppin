import { useState } from "react";

export default function FCAddIngredients(props) {
    const tempImage = 'https://www.emballagefute.com/1028-large_default/pots-a-sauce.jpg'

    const [showIngredients, setShowIngredients] = useState(true)

    const writePrice = (price) => {
        if (!price)
            price = 0

        if (price == 0) {
            return <h2 className="price">Free</h2>
        }
        return <h2 className="price addPay">+ {price} ₪</h2>
    }

    const clickOnAddAnIngredient = () => {
        setShowIngredients(!showIngredients)
    }

    const clickOnAnIngredient = (index) => {
        //TO DO: check if he is already in the ingredient
        console.log(index);

        //TO DO: add the ingredient to ingredient (temporary with a cross to remove it)
        setShowIngredients(false)
    }


    if (!props.adds) {
        return
    }

    return (
        <div className="addIngredientsContainer">
            <div className="buttonAddLogo" onClick={clickOnAddAnIngredient}>
                <p className="content">Add Ingredients <span style={{ fontWeight: 600 }}>+</span></p>
            </div>
            <div className="everyIngredientsContainer"
                style={{
                    maxHeight: showIngredients ? '50vh' : '0px',
                    transition: 'max-height 0.5s ease'
                }}>

                {props.adds.map((add, index) => (
                    <div className="ingredientContainer" key={index} onClick={() => clickOnAnIngredient(index)}>
                        <img src={add.img || tempImage} />
                        <h1>{add.name}</h1>
                        {writePrice(add.price)}
                    </div>
                ))}
            </div>

        </div>
    )

}
