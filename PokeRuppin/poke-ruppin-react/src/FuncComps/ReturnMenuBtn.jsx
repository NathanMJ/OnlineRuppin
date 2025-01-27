export default function (props) {

    const returnMenu = () => {
        props.goto(`/menuPage/${props.name}`)
    }

    return (
        <button className="returnMenuBtn" onClick={returnMenu}>Return to the menu</button>
    )
}
