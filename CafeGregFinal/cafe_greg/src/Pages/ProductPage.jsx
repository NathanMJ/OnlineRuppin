import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { get_product } from "../tempDB";
import FCChangeIngredient from "../FComponents/FCChangeIngredient.jsx";

export default function ProductPage(props) {

    const location = useLocation();
    const {productId, tableId } = location.state;
    const [product, setProduct] = useState(null)
    


    useEffect(() => {

        if (productId === null || productId === undefined)
            return;

        const fetchData = async () => {
            const tempProduct = await get_product(productId);
            setProduct(tempProduct);
            console.log(tempProduct);

        };
        fetchData();
    }, [productId]);


    const returnBtn = () => {
        window.history.back();
    }


    if (product === null) {
        return <div>Loading product...</div>; // Attente du fetch
    }

    const changeIngredient = (ingredientId, newChange) => {

        const updatedProduct = {
            ...product,
            ingredients: product.ingredients.map(ingredient => {
                if (ingredient._id === ingredientId) {
                    return { ...ingredient, change_selected: newChange };
                }
                return ingredient;
            })
        };

        setProduct(updatedProduct);
    };

    const addTheCurrentOrder = () => {
        console.log('Add the order to the table');
        
        props.goto('/menu', {tableId})
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
                <h1 className="title">Ingredients</h1>
                {product.ingredients.map(ingredient => (
                    <FCChangeIngredient change={changeIngredient} ingredient={ingredient} key={ingredient._id} />
                ))}

                <button className="orderTheProduct" onClick={addTheCurrentOrder}>Order product</button>

            </div>

        </div>
    )
}
