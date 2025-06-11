export default function FCHeaderCustomers(props) {


    if (props.customers.length == 0) {
        return (<></>)
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }


    const size = '5vh'
    return (
        <div className='headerCustomers' style={{
            width: '100vw',
            position: 'fixed',
            top: '0px',
            left: '0px',
            display: 'flex',
            flexDirection: 'row',
            padding: size,
            gap: size,
            overflowX: 'auto',
            backgroundColor: 'rgb(0, 0, 0, 0.25)',
        }}>
            <h1>Customers :</h1>
            {props.customers.map(customer =>
                <div key={customer.id} style={{
                    position: 'relative'
                }}>

                    <p style={{
                        fontSize: size,
                        background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.59), rgba(0, 0, 0, 0.19))',
                        backgroundColor: getRandomColor(),
                        padding: '8px 12px',
                        borderRadius: '25px',
                        border: '3px solid white'
                    }}>{customer.name}</p>

                    <img style={{
                        borderRadius: '100%',
                        border: '3px solid white',
                        position: 'absolute',
                        top: '0px',
                        right: '0px',
                        transform: 'translate(50%, -50%)',
                        width: size,
                    }} src='./Pictures/Cross.png' onClick={() => props.logOut(customer.id)} />

                </div>


            )} </div>
    )
}
