export default function FCSaladsProduct(props) {

    const writePrice = (price) => {
        if (price == 0) {
            return 'Free'
        }
        return '+' + price + '₪'
    }

    console.log(props.salads);
    
    return (
        <div className="saladsContainer">
            <h1 className="title">Salad to choose</h1>
            <div className="salads">
                {props.salads.map((salad) => (
                    <div className={`salad ${props.selectedSalad == salad._id && 'selected'}`} key={salad._id} style={{
                        backgroundImage:
                            'url("https://www.eatingwell.com/thmb/xzR1INWu-qKNgOqwG4cIMERqsMo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/eat-the-rainbow-chopped-salad-with-basil-mozzarella-beauty-184-278133-4000x4000-ef8f3f0ad7134d2b860c51f5e7b38ce5.jpg")'
                    }}
                    onClick={() => props.selectSalad(salad._id)}
                    >
                        <p className="name">{salad.name}</p>
                        <p className={`price ${salad.price !== 0 ? 'addPay' : ''}`}>{writePrice(salad.price)}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
