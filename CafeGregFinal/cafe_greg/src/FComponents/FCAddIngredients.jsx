import { useRef, useState } from "react";

export default function FCAddIngredients(props) {
    const tempImage = 'https://www.emballagefute.com/1028-large_default/pots-a-sauce.jpg'

    const [showIngredients, setShowIngredients] = useState(false)

    const sectionRef = useRef(null)

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
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', 
            block: 'center' });

    }

    const clickOnAnIngredient = (index) => {
        setShowIngredients(false)
        props.addAnIngredient(index)
    }

    const clickOnRemoveAnAddedIngredient = (name) => {
        props.removeAnAddedIngredient(name)
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
                }} ref={sectionRef}>

                {props.adds.map((add, index) => (
                    <div className="ingredientContainer" key={index} onClick={() => clickOnAnIngredient(index)}>
                        <img src={add.img || tempImage} />
                        <h1>{add.name}</h1>
                        {writePrice(add.price)}
                    </div>
                ))}

            </div>

            {props.addedIngredients?.length > 0 &&
                <div className="addedIngredients">
                    {props.addedIngredients.map((eachIng, index) => (
                        <div className="wrapEachAddedIngredient" key={index}>
                            <div className="eachAddedIngredient">
                                <img src={eachIng.img || tempImage} />
                                <h1>{eachIng.name}</h1>
                                {writePrice(eachIng.price)}
                            </div>
                            <h3 onClick={() => clickOnRemoveAnAddedIngredient(eachIng.name)} >Remove item</h3>
                        </div>
                    ))}
                </div>
            }
        </div>
    )

}
