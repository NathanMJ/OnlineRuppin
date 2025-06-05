export default function FCSaucesProduct(props) {
    const maxAdd = 3;
    const eachAddPrice = 1
    const tempImage = 'https://www.emballagefute.com/1028-large_default/pots-a-sauce.jpg'
    
    const writePrice = (price) => {
        if (price == 0 || !price) {
            return 'Free'
        }
        return '+' + price + '₪'
    } 

    
    
    return (
        <div className="saucesContainer">
            <h1 className="title">Sauces</h1>
            <div className="sauces">
                {props.sauces.map(sauce => (
                    <div className="sauce" key={sauce._id}>
                        <h1 className="name">{sauce.name}</h1>
                        <div className="imageContainer">
                            <img src={tempImage}/>
                        </div>
                        <div className="counterSection">
                            <p>-</p>
                            <p className="quantity">3</p>
                            <p>+</p>
                        </div>
                        <h1 className="price">{writePrice(sauce.price)}</h1>
                    </div>
                ))}
            </div>
        </div>
    )
}
