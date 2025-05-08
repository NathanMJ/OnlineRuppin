import React from 'react'

export default function HeaderCustomers(props) {


    if (props.customers.length == 0) {
        return (<></>)
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
            backgroundColor: 'red',
        }}> {props.customers.map(customer =>
            <div key={customer.id} style={{
                position: 'relative'
            }}>
                <p style={{
                    padding: '0px',
                    fontSize: size,
                    backgroundColor: 'blue',
                    color: 'white',
                    padding: '8px',
                    margin: '0px',
                    borderRadius: '25px'
                }}>{customer.name}</p>

                <img style={{
                    borderRadius: '100%',
                    border: '3px solid white',
                    position: 'absolute',
                    top: '0px',
                    right: '0px',
                    transform: 'translate(50%, -50%)',
                    width: size,
                }} src='./Pictures/X_icon.png'/>

            </div>


        )} </div>
    )
}
