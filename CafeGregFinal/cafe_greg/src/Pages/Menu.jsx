import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import FCOrders from '../FComponents/FCOrders';
import { get_from_section, get_previous_section, orders } from '../tempDB.js';
import FCSection from '../FComponents/FCSection.jsx';
export default function Menu() {


    const location = useLocation();
    const tableId = location.state?.tableId || null;
    if (!tableId) {
        return <div>Error: Table ID is required</div>;
    }

    //For orders side :

    const [totalPrice, setTotalPrice] = useState(0);


    useEffect(() => {
        const tempTotalPrice = orders.reduce((acc, order) => {
            return acc + (order.price || 0);
        }, 0);
        setTotalPrice(tempTotalPrice);
        console.log(`Total price calculated: ${tempTotalPrice} ₪`);
    }, [orders])

    //For menu side :


    //Function of the researched product

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



    //For sections/products 

    const [sectionId, setSectionId] = useState(0);
    const [mainContent, setMainContent] = useState([]);

    useEffect(() => {
        if (sectionId != null && sectionId != undefined) {
            console.log(`Go with sectionId : ${sectionId}`);
            // Fetch sections from the server 
            let res = get_from_section(sectionId)
            console.log(res);

            setMainContent(res);

        }
    }, [sectionId])

    const backInTheMenu = () => {
        const previousSectionId = get_previous_section(sectionId);
        setSectionId(previousSectionId);
    }



    const askWaiter = () => {
        //TO DO: 
        //      add notification that the waiter is coming to help
        alert('Asking the waiter for help...');
    }

    const clickOnProduct = (productId) => {
        alert(`Clicked on product with ID: ${productId}`);
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
        console.log(result);

        return result.map((row, rowIndex) => (
            <div className='row' key={rowIndex}>
                {row.map((section) => (
                    <FCSection setSectionId={setSectionId} section={section} key={section._id}></FCSection>
                ))}
            </div>
        ));


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
                    <h1>Total {totalPrice} ₪</h1>
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
                            <button onClick={askWaiter}>Ask a waiter</button>
                        </div>
                    </div>
                    <div className='logo'>
                        <img src="../Pictures/Cafe-greg-logo.png" alt="" />
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
                                <div className='product' key={product._id}>
                                    <h2>{product.name}</h2>
                                </div>
                            ))}
                        </div>}
                </div>
            </div>
        </div>
    )
}
