import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchProduct } from "../tempDB";

export default function ProductPage() {


    const location = useLocation();
    const productId = location.state.productId;

    const [product, setProduct] = useState(null)

    console.log(location.state);

    useEffect(() => {
        console.log('useEffect for productId:', productId);
        
        if (productId === null || productId === undefined) 
            return;

        const fetchData = async () => {
            console.log('fetch product data for productId:', productId);
            const tempProduct = await fetchProduct(productId);
            setProduct(tempProduct);
        };
        fetchData();
    }, [productId]);


    const returnBtn = () => {
        window.history.back();
    }


    if (product === null) {
        return <div>Loading product...</div>; // Attente du fetch
    }


    return (
        <div className="productPage">
            <div className="productDescription">
                <button className="returnButton"
                    onClick={returnBtn}>Return</button>
                <h1 className="name">{product.name}</h1>
                <img src={product.img} />
                <h2 className="price">{product.price}₪</h2>
                <h3 className="descriptionTitle">Description</h3>
                <p className="description">
                    {product.description}
                </p>
            </div>
            <div className="productChanges">

            </div>
        </div>
    )
}
