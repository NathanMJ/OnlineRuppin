import AsyncStorage from '@react-native-async-storage/async-storage';

export const setInitialProducts = async () => {
    
    const existing = await AsyncStorage.getItem('products');
    if (!existing) {
        console.log('Setting initial products...');
        const products = [
            {
                id: 0,
                name: 'Shoes',
                price: 50,
                description: 'This shoes are the best shoes ever',
                image: 'https://media.istockphoto.com/id/1350560575/photo/pair-of-blue-running-sneakers-on-white-background-isolated.jpg?s=612x612&w=0&k=20&c=A3w_a9q3Gz-tWkQL6K00xu7UHdN5LLZefzPDp-wNkSU=',
            },
            {
                id: 1,
                name: 'Bike',
                price: 250,
                description: 'This bike is the best bike ever',
                image: 'https://www.radioflyer.com/cdn/shop/files/flyer-24_-kids_-bike-profile-model-845BR_d1a02114-c9e5-4ef6-9302-57769bc310a6.jpg?v=1710802718&width=1214',
            },
            {
                id: 2,
                name: 'Car',
                price: 2500,
                description: 'This car is the best car ever',
                image: 'https://imgcdn.zigwheels.vn/medium/gallery/exterior/9/958/honda-hr-v-18808.jpg',
            },
            {
                id: 3,
                name: 'Boat',
                price: 5000,
                description: 'This boat is the best boat ever',
                image: 'https://www.huntsmarine.com.au/cdn/shop/articles/620_Fishfisher_24_2048x2048.jpg?v=1701991259',
            },
            {
                id: 4,
                name: 'Plane',
                price: 10000,
                description: 'This place is the best plane ever',
                image: 'https://static01.nyt.com/images/2021/02/26/travel/26United-plane-explainer1/26United-plane-explainer1-mediumSquareAt3X.jpg',
            },
        ]
        await AsyncStorage.setItem('products', JSON.stringify(products));
    }
};

export const getProducts = async () => {
    const products = await AsyncStorage.getItem('products');
    return products ? JSON.parse(products) : [];
};

export const setProducts = async (products) => {
    await AsyncStorage.setItem('products', JSON.stringify(products));
}

export const addProduct = async (product) => {
    const products = await getProducts();
    products.push(product);
    await AsyncStorage.setItem('products', JSON.stringify(products));
    return { success: true }; // Product added successfully
}

export const emptyProducts = async () => {
    //remove the products from the localStorage
    await AsyncStorage.removeItem('products');
    //set the initial products
    await setInitialProducts();
    console.log('Products emptied and reset to initial state.');
}