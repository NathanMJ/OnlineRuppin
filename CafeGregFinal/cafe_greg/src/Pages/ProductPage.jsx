import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { get_product } from "../tempDB";
import FCChangeIngredient from "../FComponents/FCChangeIngredient.jsx";
import FCSaladsProduct from "../FComponents/FCSaladsProduct.jsx";
import FCSaucesProduct from "../FComponents/FCSaucesProduct.jsx";

export default function ProductPage(props) {

    const location = useLocation();
    const { productId, tableId } = location.state;
    const [product, setProduct] = useState(null)

    const [selectedSalad, setSelectedSalad] = useState(0);
    const [selectedSauces, setSelectedSauces] = useState([])

    /*  Template :

        selectedSauce = {
            id,
            quantity        
        } 
    */

    useEffect(() => {

        if (productId === null || productId === undefined)
            return;

        const fetchProduct = async () => {
            const tempProduct = await get_product(productId);
            setProduct(tempProduct);

        };
        fetchProduct();
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
        props.goto('/menu', { tableId })
    }

    const selectSalad = (saladId) => {
        setSelectedSalad(saladId)
    }



    const addSauce = (sauceId) => {
        const exist = selectedSauces.find(sauce => sauce.id === sauceId)
        console.log('exist', exist);

        //if the sauce is already in selectedSauces use changeQuantitySauce(sauceId, '+')
        if (exist) {
            changeQuantitySauce(sauceId, '+')
        }
        else {
            //if not existing add it in selectedSauces
            selectedSauces.push({ id: sauceId, quantity: 1 })
        }

    }

    const changeQuantitySauce = (sauceId, mark) => {

        const indexSauce = selectedSauces.findIndex(sauce => sauce.id == sauceId)

        if (indexSauce == null) {
            return
        }

        let tempSelectedSauces = [...selectedSauces];
        let sauce = { ...tempSelectedSauces[indexSauce] };

        switch (mark) {
            case '-':
                sauce.quantity--;
                if (sauce.quantity === 0) {
                    tempSelectedSauces.splice(indexSauce, 1);
                } else {
                    tempSelectedSauces[indexSauce] = sauce;
                }
                setSelectedSauces(tempSelectedSauces);
                return;

            case '+':
                sauce.quantity++;
                tempSelectedSauces[indexSauce] = sauce;
                setSelectedSauces(tempSelectedSauces);
                return;
        }

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
                    {/*
                    <h1 className="title">Ingredients</h1>
                     {product.ingredients.map(ingredient => (
                        <FCChangeIngredient change={changeIngredient} ingredient={ingredient} key={ingredient._id} />
                    ))}
                    {product.salads?.length > 0 ? <FCSaladsProduct selectedSalad={selectedSalad} salads={product.salads} selectSalad={selectSalad}/> : ''} */}

                    <FCSaucesProduct selectedSauces={selectedSauces} sauces={product.sauces} addSauce={addSauce} changeQuantitySauce={changeQuantitySauce} />

                </div>
                <div className="orderTheProductContainer">
                    <button className="orderTheProduct" onClick={addTheCurrentOrder}>Order product</button>
                </div>

            </div>

        </div>
    )
}
