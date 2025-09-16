import React from 'react'

export default function KitchenBarPreparation() {

    const maxTimeInMS = 200;

    //In orders get every order in the order of the time and set them according to table

    //TODO: set the pannel to change the status
    //TODO: set the timer to working
    //TODO: accessibility to hide the ingredients





    const groupOfOrders = [
        {
            table: 5,
            orders: [{
                _id: 11,
                productId: 4,
                changes: [
                    {
                        _id: 11,
                        name: "spinach",
                        change: "aside",
                        price: 0
                    },
                    {
                        _id: 3,
                        name: "egg",
                        change: "omelette",
                        price: 0
                    },
                    {
                        _id: 17,
                        name: "black pepper",
                        change: "a lot of",
                        price: 0
                    }
                ],
                adds: [
                    {
                        name: "smoked salmon",
                        price: 15,
                        _id: 10
                    }
                ],
                salad: {
                    _id: 3,
                    name: "Galilee salad",
                    description: "red quinoa, black lentils, greens, cranberries, almonds",
                    price: 15
                },
                ingredients: [
                    {
                        _id: 15,
                        name: "hollandaise"
                    },
                    {
                        _id: 16,
                        name: "onion jam"
                    },
                    {
                        _id: 9,
                        name: "green onion"
                    }
                ],
                img: "https://imageproxy.wolt.com/menu/menu-images/shared/e8222ada-b2d9-11ee-b363-a2e21199740d_benedict_photoroom.jpg?w=600",
                name: "Eggs Benedict",
                price: 68,
                status: {
                    _id: 0,
                    time: "12:07:33",
                    code: 0,
                    orderId: 11,
                    status: "pending",
                    background_color: "red",
                    color: "white"
                }
            }, {
                _id: 12,
                productId: 4,
                changes: [
                    {
                        _id: 11,
                        name: "spinach",
                        change: "aside",
                        price: 0
                    },
                    {
                        _id: 3,
                        name: "egg",
                        change: "omelette",
                        price: 0
                    },
                    {
                        _id: 17,
                        name: "black pepper",
                        change: "a lot of",
                        price: 0
                    }
                ],
                adds: [
                    {
                        name: "smoked salmon",
                        price: 15,
                        _id: 10
                    }
                ],
                salad: {
                    _id: 3,
                    name: "Galilee salad",
                    description: "red quinoa, black lentils, greens, cranberries, almonds",
                    price: 15
                },
                ingredients: [
                    {
                        _id: 15,
                        name: "hollandaise"
                    },
                    {
                        _id: 16,
                        name: "onion jam"
                    },
                    {
                        _id: 9,
                        name: "green onion"
                    }
                ],
                img: "https://imageproxy.wolt.com/menu/menu-images/shared/e8222ada-b2d9-11ee-b363-a2e21199740d_benedict_photoroom.jpg?w=600",
                name: "Eggs Benedict",
                price: 68,
                status: {
                    _id: 0,
                    time: "12:07:33",
                    code: 0,
                    orderId: 11,
                    status: "pending",
                    background_color: "red",
                    color: "white"
                }
            }, {
                _id: 13,
                productId: 4,
                changes: [
                    {
                        _id: 11,
                        name: "spinach",
                        change: "aside",
                        price: 0
                    },
                    {
                        _id: 3,
                        name: "egg",
                        change: "omelette",
                        price: 0
                    },
                    {
                        _id: 17,
                        name: "black pepper",
                        change: "a lot of",
                        price: 0
                    }
                ],
                adds: [
                    {
                        name: "smoked salmon",
                        price: 15,
                        _id: 10
                    }
                ],
                salad: {
                    _id: 3,
                    name: "Galilee salad",
                    description: "red quinoa, black lentils, greens, cranberries, almonds",
                    price: 15
                },
                ingredients: [
                    {
                        _id: 15,
                        name: "hollandaise"
                    },
                    {
                        _id: 16,
                        name: "onion jam"
                    },
                    {
                        _id: 9,
                        name: "green onion"
                    }
                ],
                img: "https://imageproxy.wolt.com/menu/menu-images/shared/e8222ada-b2d9-11ee-b363-a2e21199740d_benedict_photoroom.jpg?w=600",
                name: "Eggs Benedict",
                price: 68,
                status: {
                    _id: 0,
                    time: "12:07:33",
                    code: 0,
                    orderId: 11,
                    status: "pending",
                    background_color: "red",
                    color: "white"
                }
            }]
        },
        {
            table: 20,
            orders: [{
                _id: 11,
                productId: 4,
                changes: [
                    {
                        _id: 11,
                        name: "spinach",
                        change: "aside",
                        price: 0
                    },
                    {
                        _id: 3,
                        name: "egg",
                        change: "omelette",
                        price: 0
                    },
                    {
                        _id: 17,
                        name: "black pepper",
                        change: "a lot of",
                        price: 0
                    }
                ],
                adds: [
                    {
                        name: "smoked salmon",
                        price: 15,
                        _id: 10
                    }
                ],
                salad: {
                    _id: 3,
                    name: "Galilee salad",
                    description: "red quinoa, black lentils, greens, cranberries, almonds",
                    price: 15
                },
                ingredients: [
                    {
                        _id: 15,
                        name: "hollandaise"
                    },
                    {
                        _id: 16,
                        name: "onion jam"
                    },
                    {
                        _id: 9,
                        name: "green onion"
                    }
                ],
                img: "https://imageproxy.wolt.com/menu/menu-images/shared/e8222ada-b2d9-11ee-b363-a2e21199740d_benedict_photoroom.jpg?w=600",
                name: "Eggs Benedict",
                price: 68,
                status: {
                    _id: 0,
                    time: "12:07:33",
                    code: 0,
                    orderId: 11,
                    status: "pending",
                    background_color: "red",
                    color: "white"
                }
            }]
        }
    ]

    return (
        <div className='kitchenBarPreparationPage'>
            <header>
                <p>Received time</p>
                <p>Cooked time</p>
            </header>
            <div className='ordersSide'>
                {groupOfOrders.map((g, index) => {
                    return <div className='table' key={index}>
                        <p className='numberOfTheTable'>{g.table}</p>
                        <div className='orders'>
                            {g.orders.map(o => {
                                return <div className='order' key={o._id}>
                                    <div className='headerOrder'>
                                        <p className='name'>{o.name}</p>
                                        <img src={o.img} />
                                    </div>
                                    <div className='ingredients'>
                                        {o.ingredients && <div className='base'>
                                            <h1>Base:</h1>
                                            {o.ingredients.map((i) => {
                                                return <p key={i._id}>{i.name}</p>
                                            })}
                                        </div>}

                                        {o.changes && <div className='changes'>
                                            <h1>Changes:</h1>
                                            {o.changes.map((i) => {
                                                return <p key={i._id}>{i.change} {i.name}</p>
                                            })}
                                        </div>}

                                        {o.adds && <div className='adds'>
                                            <h1>Adds:</h1>
                                            {o.adds.map((i) => {
                                                return <p key={i._id}>{i.name}</p>
                                            })}
                                        </div>}
                                    </div>
                                    <div className='footer'>
                                            <p className='receivedTimer timer'>00:00</p>
                                            <p className='wordTimer timer'>00:00</p>
                                            <p className="status"
                                            style={{backgroundColor:o.status.background_color,
                                                color:o.status.color
                                            }}>{o.status.status}</p>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                })}
            </div>
        </div>
    )
}
