export default function FCChangeIngredient(props) {

    const changeSelected = (ingredientId, newChange) => {
        props.change(ingredientId, newChange)
    }

    const capitalFirstLetter = (word) => {
        if (!word)
            return ''
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }

    const writePrice = (price) => {
        if (price == 0)
            return <h2 className="price">Free</h2>
        else
            return <h2 className="price addPay">+{price}₪</h2>
    }

    return (
        <div className="ingredients">
            <h1 className="ingredientName">{capitalFirstLetter(props.ingredient.name)}</h1>
            <div className="changesContainer">
                {props.ingredient.changes.map((change, index) => {
                    return <div
                        className={`change 
                            ${index == 0 && 'firstChange'}
                            ${index == (props.ingredient.changes.length - 1) && 'lastChange'} 
                            ${props.changeChosen !== undefined ? (change._id == props.changeChosen && 'selectedChange') : props.ingredient.change_selected == change._id && 'selectedChange'}`} key={change._id}
                        onClick={() => changeSelected(props.ingredient._id, change._id)}>
                        <h2 className="name">{capitalFirstLetter(change.change)}</h2>
                        {writePrice(change.price)}
                    </div>
                })}
            </div>
        </div>
    )
}
