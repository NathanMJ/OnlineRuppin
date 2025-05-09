import React from 'react'

export default function HeaderCustomers(props) {


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
            backgroundColor: 'rgb(255, 255, 255, 0.5)',
        }}> 
        <h1>Customers :</h1>
        {props.customers.map(customer =>
            <div key={customer.id} style={{
                position: 'relative'
            }}>
                <p style={{
                    padding: '0px',
                    fontSize: size,
                    background: 'linear-gradient(90deg, rgba(235, 229, 229, 0.86), rgba(201, 195, 195, 0.66))',
                    backgroundColor: getRandomColor(),
                    padding: '8px 12px',
                    margin: '0px',
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
                }} src='./Pictures/X_icon.png' onClick={() => props.logOut(customer.id)}/>

            </div>


        )} </div>
    )
}
