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
        //TODO : if the price is not 0 put the price in red 

        if (price == 0)
            return <h2 className="price">Free</h2>
        else
            <h2 className="price notFree">{change.price}</h2>
    }

    return (
        <div className="ingredients">
            <h1 className="ingredientName">{capitalFirstLetter(props.ingredient.name)}</h1>
            <div className="changesContainer">
                {props.ingredient.changes.map(change => {
                    return <div
                        className={`change ${props.ingredient.change_selected == change._id ? 'selectedChange' : ''}`} key={change._id}
                        onClick={() => changeSelected(props.ingredient._id, change._id)}>
                        <h2 className="name">{capitalFirstLetter(change.change)}</h2>
                        {writePrice(change.price)}
                    </div>
                })}
            </div>
        </div>
    )
}
