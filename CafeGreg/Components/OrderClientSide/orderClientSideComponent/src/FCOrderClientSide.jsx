import React from 'react'
import FCAddSubOrder from './FCAddSubOrder.jsx';
import FCTimer from './FCTimer.jsx';

export default function FCOrderClientSide(props) {
    let size = 0.6;
    /*
                picture   name
                picture   price
                +
                -
                    status time 
    */

    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const colorAccordingToStatus = (status) => {
        switch (status) {
            case 'ordered':
                //green
                return 'rgb(255, 255, 255)';
            case 'preparing':
                return 'orange';
            case 'ready':
                return 'green';
            case 'delivered':
                return 'blue';
            case 'canceled':
                return 'red';
            default:
                return 'white';
        }
    }

    const backgroundColorAccordingToStatus = (status) => {
        switch (status) {
            case 'ordered':
                return 'green';
            case 'preparing':
                return 'orange';
            case 'ready':
                return 'green';
            case 'delivered':
                return 'blue';
            case 'canceled':
                return 'red';
            default:
                return 'white';
        }
    }

    return (
        <div>
            <div
                style={{
                    display: 'grid',
                    gridTemplateAreas: '"img name" "img price"',
                    gridTemplateColumns: '1fr 2fr',
                    gridTemplateRows: '1fr 1fr',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '30px',
                    overflow: 'hidden',
                    textAlign: 'center',
                    color: 'black',
                    fontSize: 3 * size + 'vw',
                    margin: 0,
                    padding: 0,
                    background: 'linear-gradient(0deg, rgb(222, 238, 238) 0%, rgb(169, 205, 207) 100%)',
                }}>
                <img style={{
                    gridArea: 'img', width: 20 * size + 'vw',
                    margin: 0,
                    padding: 0
                }} src={props.order.src} alt={props.order.name} />
                <p style={{
                    gridArea: 'name',
                    margin: 0,
                    padding: 0
                }}>{props.order.name}</p>
                <p style={{
                    gridArea: 'price',
                    margin: 0,
                    padding: 0
                }}>{props.order.price} ₪</p>
            </div>

            {/* Show every add and sub of the order */}

            {props.order.addSubs.length > 0 && (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: 'white',
                        color: 'black',
                        width: '50%',
                        margin: 'auto',
                        padding: '10px',
                        borderRadius: '0 0 10px 10px'
                    }}>
                    {props.order.addSubs.map((addSub, index) => (
                        <FCAddSubOrder size={size} capitalizeFirstLetter={capitalizeFirstLetter} key={index} addSub={addSub} />
                    ))}
                </div>
            )}


            {/*Show the status of the order*/}

            <div style={{
                color: colorAccordingToStatus(props.order.status),
                backgroundColor: backgroundColorAccordingToStatus(props.order.status),
                display: 'flex',
                width: 'min-content',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: '10px',
                margin: 'auto',
                padding: 10,
                borderRadius: '10px',
                translate: '0 -25%',
                fontSize: 2 * size + 'vw',
            }}>
                <p style={{
                    margin: 0,
                    padding: 0
                }}
                >{props.order.status}</p>
                <FCTimer style={{
                    margin: 0,
                    padding: 0
                }} time={props.order.time} />
            </div>

        </div>
    );
}
