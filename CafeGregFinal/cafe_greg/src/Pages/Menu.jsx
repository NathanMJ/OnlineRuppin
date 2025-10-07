import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import FCOrders from '../FComponents/FCOrders';
import FCSection from '../FComponents/FCSection.jsx';
import FCQRcode from '../FComponents/FCQRcode.jsx';
import { useIdContext } from '../Contexts/askIdContext.jsx';
import { changeStatusOfOrder, changeStatusOfTable, getFromSection, getOrderOfTable, getPreviousSection, getProductByName } from '../connectToDB.js';
import { useMessageContext } from '../Contexts/messageContext.jsx';
import { socket } from '../App.jsx';

export default function Menu(props) {

    const { addMessage } = useMessageContext();

    const { getWorkerId } = useIdContext();
    const location = useLocation();
    const tableId = location.state?.tableId ?? null;

    const [orders, setOrders] = useState([])

    const fetchOrders = async () => {
        const tempOrders = await getOrderOfTable(tableId)
        console.log('orders found from DB', tempOrders);
        setOrders([...tempOrders])
    }

    useEffect(() => {
        if (tableId != undefined && tableId != null) {
            fetchOrders()

            // S'abonner aux mises à jour de cette table
            socket.emit('subscribe:table', tableId);

            // Écouter les mises à jour en temps réel
            const handleOrdersUpdate = (data) => {
                if (data.tableId === tableId) {
                    console.log('Real-time orders update received:', data.orders);
                    setOrders(data.orders);
                }
            };

            socket.on('table:orders:updated', handleOrdersUpdate);

            // Nettoyage lors du démontage
            return () => {
                socket.emit('unsubscribe:table', tableId);
                socket.off('table:orders:updated', handleOrdersUpdate);
            };
        }
    }, [tableId])


    const [showQRcode, setShowQRcode] = useState(false)

    //For orders side :

    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        if (orders.length == 0)
            return
        const tempTotalPrice = orders.reduce((acc, order) => {
            return acc + (order.price || 0);
        }, 0);
        setTotalPrice(tempTotalPrice);
    }, [orders])




    //For menu side :


    //Function of the researched product

    const [researchedProduct, setResearchedProduct] = useState('')
    const [productsFound, setProductsFound] = useState([])


    const fetchProductByName = async () => {
        let tempProduct = await getProductByName(researchedProduct);
        setProductsFound(tempProduct)
    }

    useEffect(() => {
        // If the researchedProduct is empty or only contains whitespace, set researchedsProducts to an empty array
        if (!researchedProduct || researchedProduct.trim() === "") {
            setProductsFound([]);
            return;
        }

        //research the top 4 products that match the most to the researchedProuct

        if (researchedProduct) {
            fetchProductByName()
        }

    }, [researchedProduct])



    //For sections/products 

    const [sectionId, setSectionId] = useState(location.state?.sectionId ?? 0);
    const [mainContent, setMainContent] = useState([]);


    const fetchSection = async () => {
        if (sectionId != null && sectionId != undefined) {
            let res = await getFromSection(sectionId)
            setMainContent(res);
        }
    }

    useEffect(() => {
        fetchSection()
    }, [sectionId])

    const backInTheMenu = async () => {
        const previousSectionId = await getPreviousSection(sectionId);
        setSectionId(previousSectionId);
    }



    const askWaiter = () => {
        addMessage('A waiter has been called to your table', 'info', 5000);
        changeStatusOfTable(tableId, 1);
    }

    const placeSections = () => {
        let arr = mainContent.sections;
        let count = arr.length;
        let numberOfRows = Math.floor(arr.length / 3);
        if (arr.length % 3 > 0)
            numberOfRows++;
        let min = Math.floor(arr.length / numberOfRows);
        let tooMuch = (count % numberOfRows);
        let index = 0;
        let result = []


        for (let i = 0; i < numberOfRows; i++) {
            let tempArrLengthJog = min;
            //Start the row - Add new row
            let row = []
            if (tooMuch > 0 && tooMuch % 2 == i % 2) {
                tempArrLengthJog = min + 1;
            }
            for (let j = 0; j < tempArrLengthJog; j++) {
                // Add the section[index++]
                row.push(arr[index++])
            }
            result.push(row)
            //Close the row
        }

        return result.map((row, rowIndex) => (
            <div className='row' key={rowIndex}>
                {row.map((section) => (
                    <FCSection setSectionId={setSectionId} section={section} key={section._id}></FCSection>
                ))}
            </div>
        ));
    }

    const clickOnCafeGreg = async () => {
        const id = await getWorkerId()
        if (id) {
            props.goto('/cafeMain')
        }
    }

    const clickOnProduct = (productId) => {
    console.log('tableId sended', tableId);
        
        props.goto('/productPage', { productId, tableId, sectionId });
    }

    const clickOnRegisterLogin = () => {
        props.goto('/customerRegisterLogin', { tableId })
    }


    const getTotalPriceOfOrder = (order) => {
        let firstPrice = order.price
        //add the price of the adds if there is any
        if (order.adds && order.adds.length > 0) {
            order.adds.forEach(add => {
                firstPrice += add.price
            })
        }
        //add the price of the changes if there is any
        if (order.changes && order.changes.length > 0) {
            order.changes.forEach(ch => {
                firstPrice += ch.price
            })
        }
        //add the price of the salad if there is any
        if (order.salad) {
            firstPrice += order.salad.price
        }
        return firstPrice
    }

    const getTotalPriceOfOrders = () => {      
        let total = orders.reduce((acc, order) => {
            return acc + getTotalPriceOfOrder(order)
        }, 0)
        return total
    }

    const clickOnGreenButton = async () => {

        //if there are no orders, do nothing
        if (orders.length == 0) {
            addMessage("You have no orders", "error", 5000)
            return
        }
        //if there are orders with status 0 confirm the orders
        //find orders with status 0
        const pendingOrders = orders.reduce((acc, order) => {
            if (order.status._id == 0) {
                acc.push(order)
            }
            return acc
        }, [])
        if (pendingOrders.length > 0) {
            await Promise.all(pendingOrders.map(order => changeStatusOfOrder(order._id, 1, tableId, order.destination)))
            addMessage("Orders successully", "success", 5000)
            fetchOrders()
            return
        }
        //if every order is confirmed ask to pay
        const notEveryOrderIsReceived = orders.some(order => order.status._id != 5)
        if (!notEveryOrderIsReceived) {
            changeStatusOfTable(tableId, 2)
            addMessage("A waiter has been called to pay", "success", 5000)
            return
        }
        else {
            addMessage("You must wait to receive all your orders before asking for the bill", "error", 5000)
            return
        }

    }

    const [contentGreenButton, setContentGreenButton] = useState('Order everythings')

    useEffect(() => {
        if (orders.length == 0) {
            setContentGreenButton('Order everythings')
            return
        }
        const pendingOrders = orders.reduce((acc, order) => {
            if (order.status._id == 0) {
                acc.push(order)
            }
            return acc
        }, [])
        if (pendingOrders.length > 0) {
            setContentGreenButton('Order everythings')
            return
        }
        setContentGreenButton('Ask for the bill')
    }, [orders])

    return (
        <div className='menuPage'>

            <FCQRcode show={showQRcode} hide={() => setShowQRcode(false)}></FCQRcode>

            <div className='orderSide'>
                <div className='top'>
                    <h1>My orders</h1>
                    <div className='pipe'></div>
                </div>
                <FCOrders
                    orders={orders || []}
                    tableId={tableId}
                    refreshOrders={fetchOrders}></FCOrders>

                <div className='bottom'>
                    <div className='pipe'></div>
                    <button onClick={clickOnGreenButton}>{contentGreenButton}</button>
                    <div className='pipe'></div>
                    <h1>Total {getTotalPriceOfOrders()} ₪</h1>
                </div>
            </div>
            <div className='main'>
                <header>
                    <div className='leftLogo'>
                        <div className='registerLogin'>
                            <button onClick={clickOnRegisterLogin}>
                                <p>Register/Login</p>
                                <p className='littleText'>See my previous orders</p>
                            </button>
                            <div className='qrCode'>
                                <img src="../Pictures/Qr-code-logo.png" onClick={() => setShowQRcode(!showQRcode)} />
                            </div>
                        </div>
                        <div className='help'>
                            <button onClick={askWaiter}>Ask a waiter</button>
                        </div>
                    </div>
                    <div className='logo'>
                        <img src="../Pictures/Cafe-greg-logo.png" onDoubleClick={clickOnCafeGreg} />
                    </div>
                    <div className='rightLogo'>
                        <div className='research'>
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
                        {sectionId == 0 || <div className='backButtonContainer'><button className='backButton' onClick={backInTheMenu}>Back</button></div>}
                    </div>
                </header>
                <div className='menu'>
                    {mainContent.type == "section" ?
                        <div className='sections'>{placeSections()}</div> :
                        mainContent.products &&
                        <div className='products'>
                            {mainContent.products.map((product) => (
                                <div className='product' key={product._id}
                                    style={{ backgroundImage: `url(${product.img})` }}
                                    onClick={() => clickOnProduct(product._id)}>
                                    <p className='name'>{product.name}</p>
                                    <div className='priceContainer'>
                                        <p className='price'>{product.price}₪</p>
                                    </div>
                                </div>
                            ))}
                        </div>}
                </div>
            </div>
        </div>
    )
}
