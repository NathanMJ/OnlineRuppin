import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { get_product } from "../tempDB";
import FCChangeIngredient from "../FComponents/FCChangeIngredient.jsx";
import FCSaladsProduct from "../FComponents/FCSaladsProduct.jsx";

export default function ProductPage(props) {

    const location = useLocation();
    const { productId, tableId } = location.state;
    const [product, setProduct] = useState(null)

    //temp

    const [selectedSalad, setSelectedSalad] = useState(0);

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

        props.goto('/menu', { tableId })
    }

    const selectSalad = (saladId) => {
        console.log(saladId);        
        setSelectedSalad(saladId)
    }

    return (
        <div className="productPage">
            <div className="leftPage">
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

            <div className="rightPage">
                <div className="contentProduct">

                    <h1 className="title">Ingredients</h1>
                    {product.ingredients.map(ingredient => (
                        <FCChangeIngredient change={changeIngredient} ingredient={ingredient} key={ingredient._id} />
                    ))}
                    {product.salads?.length > 0 ? <FCSaladsProduct selectedSalad={selectedSalad} salads={product.salads} selectSalad={selectSalad}/> : ''}
                </div>
                <div className="orderTheProductContainer">
                    <button className="orderTheProduct" onClick={addTheCurrentOrder}>Order product</button>
                </div>

            </div>

        </div>
    )
}
