import { useState } from "react";

export default function FCHeaderCustomers(props) {

    const [showCustomers, setShowCustomers] = useState(null)

    if (props.customers.length == 0) {
        return (<></>)
    }

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    return (
        <div className={`headerCustomers ${showCustomers === null ? '' :
            showCustomers == 0 ? 'goDown' : 'goUp'}`}>
            <div className='customersContainer'>

                <h1 style={{ fontSize: '50px', paddingInline: '30px', display: "flex", justifyContent: "center", alignItems: 'center' }}>Customers :</h1>
                {props.customers.map((customer, index) =>
                    <div key={index} style={{
                        position: 'relative', backgroundColor: getRandomColor()
                    }} className="customerContainer">


                        <h1 className="name" >{customer.name}</h1>
                        <h2 className="id">({customer.id})</h2>

                        <img style={{
                            borderRadius: '100%',
                            border: '3px solid white',
                            position: 'absolute',
                            top: '0px',
                            right: '0px',
                            transform: 'translate(50%, -50%)',
                            width: '50px',
                        }} src='./Pictures/Cross.png' onClick={() => props.logOut(customer.id)} />

                    </div>


                )}
            </div>

            <div className="historyContainer">
                <img src="https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/history2.png" />
                <h1>See your order's history</h1>
            </div>

            <div className="showCustomersButton" onClick={() => setShowCustomers(!showCustomers)}>
                <img src="https://www.kindpng.com/picc/m/76-768103_customer-feedback-and-reviews-observablehq-logo-hd-png.png" />
                <h1>{!showCustomers ? 'See' : 'Hide'} logged customers</h1>
            </div>


        </div>
    )
}
