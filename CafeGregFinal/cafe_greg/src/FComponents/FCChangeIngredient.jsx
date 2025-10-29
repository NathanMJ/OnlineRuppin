import { useEffect, useState } from "react"

export default function FCChangeIngredient(props) {

    const [wantNote, setWantNote] = useState(false)
    const [note, setNote] = useState('')

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

    useEffect(() => {
        if (wantNote) {
            props.writeNoteForChange(props.ingredient._id, '')
        }
        else {
            props.deleteNoteForChange(props.ingredient._id)
        }
    }, [wantNote])

    useEffect(() => {
        if (wantNote) {
            props.writeNoteForChange(props.ingredient._id, note)
        }
    }, [note])

    const handleNoteChange = (e) => {
        setNote(e.target.value)
    }

    return (
        <div className="ingredients">
            <h1 className="ingredientName">{capitalFirstLetter(props.ingredient.name)}</h1>
            <div className="changesAndNotesContainer">
                <div className="changesContainer">
                    {props.ingredient.changes.map((change, index) => {
                        const isSelected = props.changeChosen !== undefined ? (change._id == props.changeChosen && 'selectedChange') : props.ingredient.selected == change._id && 'selectedChange'
                        return <div
                            className={`change 
                            ${index == 0 && 'firstChange'}
                            ${index == (props.ingredient.changes.length - 1) && 'lastChange'} 
                            ${isSelected && 'selectedChange'}`} key={change._id}
                            onClick={() => { !isSelected && changeSelected(props.ingredient._id, change._id) }}>
                            <h2 className="name">{capitalFirstLetter(change.change)}</h2>
                            {writePrice(change.price)}
                        </div>
                    })}
                </div>
                <div className={`notesContainer ${wantNote && 'selected'}`} onClick={() => { setWantNote(!wantNote), setNote('') }}>
                    <p>Add notes</p>
                    <img src="../Pictures/Note-logo.png" alt="" />
                </div>
            </div>
            <div className="notesContainerExpanded" style={{ display: wantNote ? 'flex' : 'none' }}>
                <p>Notes:</p>
                <input type="text" value={note} onChange={handleNoteChange} className="noteInput" placeholder="Write your notes here, ex : I want it very hot" />
            </div>
        </div>
    )
}