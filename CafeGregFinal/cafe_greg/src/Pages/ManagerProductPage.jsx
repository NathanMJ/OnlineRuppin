import { useEffect, useState } from "react"
import { fetchEveryProducts, sendNewProduct } from "../connectToDB"
import ReturnButton from "../FComponents/ReturnButton"
import { useMessageContext } from "../Contexts/messageContext";

export default function ManagerProductPage() {

    const { addMessage } = useMessageContext();

    const [currentProduct, setCurrentProduct] = useState({})

    const [everyProducts, setEveryProducts] = useState([])


    const [indexProduct, setIndexProduct] = useState(0)

    const [testImg, setTestImg] = useState(null)

    useEffect(() => {
        //fetch the products
        const fetchTheProducts = async () => {
            const tempProducts = await fetchEveryProducts()
            console.log(tempProducts);

            setEveryProducts(tempProducts)
        }

        fetchTheProducts()
        //subscribe to the realtime
    }, [])

    useEffect(() => {
        if (everyProducts.length > 0) {
            setCurrentProduct(everyProducts[indexProduct])
            setTestImg(everyProducts[indexProduct].img)
        }
    }, [indexProduct, everyProducts])

    const clickOnLeftArrow = () => {
        if (indexProduct > 0)
            setIndexProduct(prevS => prevS - 1)
    }

    const clickOnRightArrow = () => {
        if (indexProduct < everyProducts.length - 1)
            setIndexProduct(prevS => prevS + 1)
    }

    const changeTheProduct = async () => {
        if (testImg != currentProduct.img) {
            addMessage('Reset the picture if you dont want it or test it to apply it too', 'info', 10000);
        }
        const response = await sendNewProduct(currentProduct)
        console.log(response);
        
        if (response.ok) {
            addMessage('The changes have been applied', 'success', 5000)
            //change the product to the currentProduct
            everyProducts[indexProduct] = currentProduct
        }
        else {
            addMessage(response.message, 'error', 5000)

        }
    }

    if (everyProducts.length == 0)
        return <h1>Loading</h1>


    return (
        <div className='managerProductPage'>
            <button className={`arrow ${indexProduct == 0 && 'disabled'}`} onClick={clickOnLeftArrow}>{'<'}</button>
            <div className='containerProduct'>
                <div>
                    <p>Name of the product :</p>
                    <input type="text" value={currentProduct.name || ''} onChange={(e) => setCurrentProduct((prevS) => ({ ...prevS, name: e.target.value }))} />
                </div>
                <div>
                    <p>Price of the product :</p>
                    <input type="text" value={currentProduct.price || ''} onChange={(e) => setCurrentProduct((prevS) => ({ ...prevS, price: Number(e.target.value) }))} />
                </div>
                <div>
                    <p>Description of the product :</p>
                    <textarea className="text-box" value={currentProduct.description || ''}
                        onChange={(e) => setCurrentProduct((prevS) => ({ ...prevS, description: e.target.value }))} placeholder="Écris ici..."></textarea>
                </div>
                <div className="imageContainer">
                    <p>Url of the image's product :</p>
                    <input type="text" value={testImg || ''} onChange={(e) => setTestImg(e.target.value)} />
                    <img src={currentProduct.img} />
                    <button className="acceptChangesPictures" onClick={() => setCurrentProduct((prevS) => ({ ...prevS, img: testImg }))}>Test the picture</button>
                    <button className="cancelChangesPictures" onClick={() => {
                        setCurrentProduct((prevS) => ({ ...prevS, img: everyProducts[indexProduct].img }));
                        setTestImg(everyProducts[indexProduct].img)
                    }}>Reset the picture</button>
                </div>
                <div className="buttonsContainer">
                    <button className="acceptChanges" onClick={changeTheProduct}>Accept the changes</button>
                    <button className="cancelChanges" onClick={() => {
                        setCurrentProduct(everyProducts[indexProduct]);
                        setTestImg(everyProducts[indexProduct].img)
                    }}>Cancel the changes</button>
                </div>
            </div>
            <button className={`arrow ${indexProduct >= everyProducts.length - 1 && 'disabled'}`} onClick={clickOnRightArrow}>{'>'}</button>
            <ReturnButton bottom='10px' left='10px'></ReturnButton>
        </div>
    )
}
