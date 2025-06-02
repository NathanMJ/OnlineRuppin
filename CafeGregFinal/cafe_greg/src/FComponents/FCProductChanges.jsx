export default function FCProductChanges(props) {
    return (
        <div className="ingredients">
            <h1 className="ingredientName">{props.ingredient.name}</h1>
            <div className="changesContainer">
                {props.ingredient.changes.map(change => (
                    <div className="change" key={change._id}>
                        <h2 className="name">{change.change}</h2>
                        <h2 className="price">{change.price}</h2>
                        {/* <img src={change.img} alt={change.name} /> */}
                    </div>
                ))}
            </div>
        </div>
    )
}
