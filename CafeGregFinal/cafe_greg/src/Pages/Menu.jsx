import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import FCOrders from '../FComponents/FCOrders';

export default function Menu() {

    // get the tableId from the url parameters

    const location = useLocation();
    const tableId = location.state?.tableId || null;
    if (!tableId) {
        return <div>Error: Table ID is required</div>;
    }

    const [researchedProduct, setResearchedProduct] = useState('')
    const [productsFound, setProductsFound] = useState([])

    const products = [
        {
            _id: 1,
            img: 'https://www.southernliving.com/thmb/UW4kKKL-_M3WgP7pkL6Pb6lwcgM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Ham_Sandwich_011-1-49227336bc074513aaf8fdbde440eafe.jpg',
            name: 'Sandwich'
        },
        {
            _id: 2,
            img: 'https://www.southernliving.com/thmb/UW4kKKL-_M3WgP7pkL6Pb6lwcgM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Ham_Sandwich_011-1-49227336bc074513aaf8fdbde440eafe.jpg',
            name: 'Boker pour 3 personnes'
        },
        {
            _id: 3,
            img: 'https://www.southernliving.com/thmb/UW4kKKL-_M3WgP7pkL6Pb6lwcgM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Ham_Sandwich_011-1-49227336bc074513aaf8fdbde440eafe.jpg',
            name: 'Pizza'
        }
    ]

    useEffect(() => {
        console.log(`Researched product: [${researchedProduct}]`);

        // If the researchedProduct is empty or only contains whitespace, set researchedsProducts to an empty array
        if (!researchedProduct || researchedProduct.trim() === "") {
            setProductsFound([]);
            return;
        }

        //research the top 4 products that match the most to the researchedProuct

        if (researchedProduct) {
            setProductsFound(products.filter(product =>
                product.name.toLowerCase().includes(researchedProduct.toLowerCase())
            ).slice(0, 4));
        }

    }, [researchedProduct])


    const orders = [
        {
            _id: 0,
            name: 'Sandwich',
            price: 5,
            status: {
                name: 'Pending',
                color: 'white',
                backgroundColor: 'red'
            },
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

        },
        {
            _id: 1,
            name: 'Sandwich',
            price: 5,
            status: {
                name: 'Ordered',
                color: 'white',
                backgroundColor: 'green'
            },
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

        },
        {
            _id: 2,
            name: 'Sandwich',
            price: 5,
            status: {
                name: 'In preparation',
                color: 'white',
                backgroundColor: 'orange'
            },
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

        },
        {
            _id: 3,
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
            status: {
                name: 'Ready',
                color: 'white',
                backgroundColor: 'blue'
            },
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

        },
        {
            _id: 4,
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
            status: {
                name: 'Received',
                color: 'white',
                backgroundColor: 'green'
            },
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


    const clickOnProduct = (productId) => {
        alert(`Clicked on product with ID: ${productId}`);
        
    }

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
                    <div className='leftLogo'>
                        <div className='registerLogin'>
                            <button>
                                <p>Register/Login</p>
                                <p className='littleText'>See my previous orders</p>
                            </button>
                        </div>
                        <div className='help'>
                            <button>Ask a waiter</button>
                        </div>
                    </div>
                    <div className='logo'>
                        <img src="../Pictures/Cafe-greg-logo.png" alt="" />
                    </div>
                    <div className='rightLogo'>
                        <div className='researchContainer'>
                            <input onChange={(e) => setResearchedProduct(e.target.value)} type='text' placeholder='Search a product here...' />
                            <div className='researchedsProducts'>{productsFound?.map(product => {
                                return (
                                    <div className='researchedProduct' key={product._id} onClick={() => {
                                        clickOnProduct(product._id)
                                    }}>
                                        <div className='imageContainer'>
                                            <img src={product.img} alt={product.name} />
                                        </div>
                                        <h3>{product.name}</h3>
                                    </div>
                                )
                            })}</div>
                        </div>
                    </div>
                </header>
                <div className='menu'></div>
            </div>
        </div>
    )
}
