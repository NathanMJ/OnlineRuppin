import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FCChangeIngredient from "../FComponents/FCChangeIngredient.jsx";
import FCSaladsProduct from "../FComponents/FCSaladsProduct.jsx";
import FCSaucesProduct from "../FComponents/FCSaucesProduct.jsx";
import FCAddIngredients from "../FComponents/FCAddIngredients.jsx";
import { getProductById, sendOrder } from "../connectToDB.js"

export default function ProductPage(props) {

    //TODO: if we are from history get the history details and return them to get same when return

    const storeAccess = props.storeAccess


    const location = useLocation();
    const { productId, tableId, sectionId, sendedOrder, researchSettings } = location.state;

    const [product, setProduct] = useState(null)

    //is the id of the salads added
    const [selectedSalad, setSelectedSalad] = useState(sendedOrder?.salad?._id || 1)
    //is the ids of the sauces addeds
    const [selectedSauces, setSelectedSauces] = useState(sendedOrder?.sauces || [])

    //is the ids of the ingredients added
    const [addedIngredients, setAddedIngredients] = useState(sendedOrder?.adds || [])

    const [changes, setChanges] = useState(sendedOrder?.changes || [])

    const [notesForChanges, setNotesForChanges] = useState(sendedOrder?.notesForChanges || [])

    const writeNoteForChange = (ingredientId, note) => {
        if (!note || note.trim() === '') {
            deleteNoteForChange(ingredientId)
            return
        }
        const index = notesForChanges.findIndex(n => n.ingredientId == ingredientId)
        let tempNotes = notesForChanges.filter((_, i) => i !== index)
        setNotesForChanges([...tempNotes, { ingredientId, note }])
    }

    const deleteNoteForChange = (ingredientId) => {
        const newNotes = notesForChanges.filter(n => n.ingredientId != ingredientId)
        setNotesForChanges(newNotes)
    }

    const changeIngredient = (ingredientId, newChange) => {

        const ingredient = product.ingredients.find(i => ingredientId == i._id && i.selected == newChange)

        //if the change is not already the basic product just filter the product 

        const index = changes.findIndex(change => change.ingredientId == ingredientId)
        let tempChanges = changes.filter((_, i) => i !== index)

        if (!ingredient) {
            setChanges([...tempChanges, { ingredientId, change: newChange }])
        }
        else {
            setChanges(tempChanges)
        }
    };


    useEffect(() => {
        if (productId !== null && storeAccess && storeAccess.profile) {
            const fetchProduct = async () => {
                const res = await getProductById(productId, storeAccess.profile);
                if (res.ok) {
                    setProduct(res.product);
                }
            };
            fetchProduct();
        }
    }, [productId, storeAccess?.profile]);

    const returnBtn = () => {
        if (sectionId) {
            //if we got a sectionId go to the menu
            props.goto('/menu', { tableId, sectionId })
        }
        else {
            props.goto('/customerHistory', { researchSettings, tableId })
        }

    }



    if (product === null) {
        return <div>Loading product...</div>; // Attente du fetch
    }

    const addTheCurrentOrder = async () => {
        //TODO: add the current order to the list (in db)
        const tempOrder = {
            productId,
            ...(changes?.length > 0 && { changes }),
            ...(addedIngredients.length > 0 && { adds: addedIngredients }),
            ...(product.salads && { salad: selectedSalad }),
            ...(selectedSauces.length > 0 && { sauces: selectedSauces }),
            ...(notesForChanges.length > 0 && { notesForChanges })
        };

        console.log(tempOrder);

        const result = await sendOrder(storeAccess.profile, tableId, tempOrder);

        if (!result.ok) {
            alert(`Erreur: ${result.message}`);
        }
        props.goto('/menu', { tableId })
    }

    const selectSalad = (saladId) => {
        setSelectedSalad(saladId)
    }


    const addSauce = (sauceId) => {
        const exist = selectedSauces.find(sauce => sauce.id === sauceId)

        //if the sauce is already in selectedSauces use changeQuantitySauce(sauceId, '+')
        if (exist) {
            changeQuantitySauce(sauceId, '+')
        }
        else {
            //if not existing add it in selectedSauces
            selectedSauces.push({ _id: sauceId, quantity: 1 })
        }

    }

    const changeQuantitySauce = (sauceId, mark) => {

        const indexSauce = selectedSauces.findIndex(sauce => sauce._id == sauceId)

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

    const addAnIngredient = (indexAddIngredient) => {
        const addedIngredient = product.adds[indexAddIngredient]
        //check if the ingredient is already added

        if (addedIngredients.some(ingredientId => ingredientId === addedIngredient._id)) {
            return
        }
        const tempAddedIngredients = [...addedIngredients, addedIngredient._id];
        setAddedIngredients(tempAddedIngredients)
    }

    const removeAnAddedIngredient = (id) => {
        const newAddedIngredients = addedIngredients.filter(ing => ing != id)
        setAddedIngredients(newAddedIngredients)
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
                    <h1 className="title">Changes details</h1>
                    {product.ingredients.map(ingredient => {

                        return (
                            <FCChangeIngredient change={changeIngredient}
                                writeNoteForChange={writeNoteForChange} deleteNoteForChange={deleteNoteForChange}
                                ingredient={ingredient} changeChosen={changes.find(c => c.ingredientId == ingredient._id)?.change} key={ingredient._id} />
                        )
                    })}
                    {product.adds && <FCAddIngredients addedIngredients={addedIngredients} addAnIngredient={addAnIngredient} removeAnAddedIngredient={removeAnAddedIngredient} adds={product.adds} />}
                    {product.sauces?.length > 0 && <FCSaucesProduct selectedSauces={selectedSauces} sauces={product.sauces} addSauce={addSauce} changeQuantitySauce={changeQuantitySauce} />}
                    {product.salads?.length > 0 ? <FCSaladsProduct selectedSalad={selectedSalad} salads={product.salads} selectSalad={selectSalad} /> : ''}


                </div>
                <div className="orderTheProductContainer">
                    <button className="orderTheProduct" onClick={addTheCurrentOrder}>Order product</button>
                </div>

            </div>

        </div>
    )
}
