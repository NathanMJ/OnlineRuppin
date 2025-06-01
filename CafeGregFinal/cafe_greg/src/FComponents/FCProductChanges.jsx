export default function FCProductChanges(props) {
    return (
        <div>
            <h1>{props.ingredient.name}</h1>
            <div className="details">
                {props.ingredient.changes.map(change => (
                    <div className="change" key={change._id}>
                        {/* <img src={change.img} alt={change.name} /> */}
                     </div>
                ))}   
            </div>
        </div>
    )
}
