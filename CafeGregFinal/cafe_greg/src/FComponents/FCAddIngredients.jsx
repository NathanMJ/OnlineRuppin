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


    const capitalFirstLetter = (word) => {
        if (!word)
            return ''
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }


    const clickOnAddAnIngredient = () => {
        setShowIngredients(!showIngredients)
        sectionRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

    }

    const clickOnAnIngredient = (index) => {
        setShowIngredients(false)
        props.addAnIngredient(index)
    }

    const clickOnRemoveAnAddedIngredient = (id) => {
        console.log('id:', id);
        props.removeAnAddedIngredient(id)
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
                        <h1>{capitalFirstLetter(add.name)}</h1>
                        {writePrice(add.price)}
                    </div>
                ))}

            </div>

            {props.addedIngredients?.length > 0 &&
                <div className="addedIngredients">
                    {props.addedIngredients.map((eachIng, index) => {
                        console.log('eachIng', eachIng);
                        
                        const currentIngredient = props.adds.find((i) => i._id == eachIng)
                        console.log(currentIngredient);

                        return (
                            <div className="wrapEachAddedIngredient" key={index}>
                                <div className="eachAddedIngredient">
                                    <img src={currentIngredient.img || tempImage} />
                                    <h1>{capitalFirstLetter(currentIngredient.name)}</h1>
                                    {writePrice(currentIngredient.price)}
                                </div>
                                <h3 onClick={() => clickOnRemoveAnAddedIngredient(currentIngredient._id)} >Remove item</h3>
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    )

}
