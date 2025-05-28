import React from 'react'
import { useLocation, useParams } from 'react-router-dom'
import FCOrders from '../FComponents/FCOrders';

export default function Menu() {

    // get the tableId from the url parameters

    const location = useLocation();
    const tableId = location.state?.tableId || null;
    if (!tableId) {
        return <div>Error: Table ID is required</div>;
    }

    const orders = [
        {
            _id: 0,
            name: 'Sandwich',
            price: 5,
            img: 'https://www.southernliving.com/thmb/UW4kKKL-_M3WgP7pkL6Pb6lwcgM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Ham_Sandwich_011-1-49227336bc074513aaf8fdbde440eafe.jpg',
            ingredients:
                [
                    "Bread",
                    "Lettuce",
                    "Tomato",
                    "Cheese"
                ],
            changes: [
                {
                    ingredient: 'salmon',
                    change: 'add',
                },
                {
                    ingredient: 'cheese',
                    change: 'remove',
                }
            ]

        }
    ]

    return (
        <div className='menuPage'>
            <div className='orderSide'>
                <div className='top'>
                    <h1>My orders</h1>
                    <div className='pipe'></div>
                </div>
                <FCOrders orders={orders}></FCOrders>

                <div className='bottom'>
                    <div className='pipe'></div>
                    <button>Order everythings</button>
                    <div className='pipe'></div>
                    <h1>Total</h1>
                </div>
            </div>
            <div className='main'>
                <header>
                    <div className='register'>
                        <button>
                            <p>Register/Login</p>
                            <p className='littleText'>See my previous orders</p>
                        </button>
                    </div>
                    <div className='logo'>
                        <img src="../Pictures/Cafe-greg-logo.png" alt="" />
                    </div>
                    <div className='research'>
                        <input type='text' placeholder='Search...' />
                    </div>
                </header>
                <div className='menu'></div>
            </div>
        </div>
    )
}
