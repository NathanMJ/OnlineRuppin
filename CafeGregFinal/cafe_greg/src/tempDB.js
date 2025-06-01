export const tempWorkers = [{
    firstname: 'Nathan',
    lastname: 'Mimoun',
    id: '345538268',
    contact: 'nathanmimoun2001@gmail.com',
    role: ['waiter', 'kitchen']
},
{
    firstname: 'Lucas',
    lastname: 'Mimoun',
    id: '345538269',
    contact: '0584020406',
    role: ['waiter', 'kitchen', 'manager', 'bar']
}
]

export const tempTimeWorker = [
    {
        startTime: '2025-05-19T12:26:30',
        startId: '345538268',
        pauseTime: '2025-05-19T13:32:23',
        pauseId: '345538268'
    },
    {
        startTime: '2025-05-19T13:24:22',
        startId: '345538268',
        pauseTime: '2025-05-19T15:52:35',
        pauseId: '345538268'
    }
]

export const tempCafeTables = [
    {
        _id: 1,
        customers: [1, 2, 5],
        orders: [1, 2]
    },
    {
        _id: 2,
        customers: [],
        orders: [],
        ask: 1
    },
    {
        _id: 3,
        customers: [3],
        orders: [],
        ask: 1
    }
]

export const customers = [
    {
        _id: 1,
        name: 'John',
        contact: 'john@gmail.com'
    },
    {
        _id: 2,
        name: 'mick',
        contact: 'mick@gmail.com'
    },
    {
        _id: 3,
        name: 'Jojo',
        contact: 'jojo@gmail.com'
    },
    {
        _id: 5,
        name: 'Zidane',
        contact: 'zidane@gmail.com'
    },
]

export const orders = [
    {
        _id: 0,
        name: 'Sandwich',
        price: 5,
        status: {
            name: 'Pending',
            color: 'white',
            backgroundColor: 'rgb(252, 71, 71)'
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
            backgroundColor: 'rgb(117, 196, 110)'
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
            backgroundColor: '#fd855b'
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
            backgroundColor: 'rgb(60, 189, 194)'
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
            backgroundColor: 'rgb(109, 212, 100)'
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


export const sections = [
    {
        _id: 0,
        name: "Main",
        child_sections: [1, 2, 3, 4, 5]
    },
    {
        _id: 1,
        name: "Most ordered",
        img: "image.png",
        products: [0, 4, 5]
    },
    {
        _id: 2,
        name: "Starters",
        img: 'image.png',
        products: [0, 1, 2, 3, 4, 5]

    },
    {
        _id: 3,
        name: "Meals",
        img: "https://media.istockphoto.com/id/450705255/photo/homemade-turkey-thanksgiving-dinner.jpg?s=612x612&w=0&k=20&c=Bul88e51JYCw6o2JaLyvPKCZpg2R-qd2621978t7HRI=",
        child_sections: [6, 7, 8, 9, 10]
    },
    {
        _id: 4,
        name: "Desserts",
        img: "https://c.ndtvimg.com/2020-04/chd4rs3g_dessert_625x300_07_April_20.jpg",
        child_sections: [11, 12]
    },
    {
        _id: 5,
        name: "Drinks",
        img: "image.png",
        child_sections: [13, 14]
    },
    {
        _id: 6,
        name: "Main Courses",
        img: "image.png"
    },
    {
        _id: 7,
        name: "Breakfasts",
        img: "image.png",
        products: [0, 1, 2, 3, 4, 5]
    },
    {
        _id: 8,
        name: "Italians",
        img: "image.png"
    },
    {
        _id: 9,
        name: "Sandwichs",
        img: "image.png"
    },
    {
        _id: 10,
        name: "Salads",
        img: "image.png"
    },
    {
        _id: 11,
        name: "Pancakes",
        img: "image.png"
    },
    {
        _id: 12,
        name: "Waffles",
        img: "image.png"
    },
    {
        _id: 13,
        name: "Bottles/Cans",
        img: "image.png"
    },
    {
        _id: 14,
        name: "Beers",
        img: "image.png",
        need_autorization: true
    }
]




const products = [
    {
        _id: 0,
        name: "Turkish Bourekas",
        img: "https://gregcafe.co.il/wp-content/uploads/2025/01/בורקס-טורקי-scaled.jpg",
        price: 59.00,
        description: "Bourekas stuffed with cheeses, served with labneh and olive oil, green tahini and spiced chickpeas, hard-boiled egg, spicy jalapeño spread, crushed tomatoes and olive oil. Served with pickles and fresh vegetables.",
        ingredients: [0, 1, 2, 3, 4, 5, 6],
        sauces: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    },
    {
        _id: 1,
        name: "American Waffle",
        img: "https://imageproxy.wolt.com/menu/menu-images/shared/bbcd2fc0-b2d9-11ee-a2ce-2a26bf50e9fb_vafel_americai_2_photoroom.jpg?w=600",
        price: 61.00,
        description: "Crispy waffle, sautéed onions and mushrooms in four-cheese sauce, poached eggs, green onion, served with a salad of your choice.",
        ingredients: [7, 8, { _id: 3, selected: 7 }, 9],
        salads: [0, 1, 2, { _id: 3, price: 15 }]
    },
    {
        _id: 2,
        name: "Norwegian Waffle",
        img: "https://imageproxy.wolt.com/menu/menu-images/shared/bf8100ce-b2d9-11ee-996c-66c5b47bd167_vafel_norvegi_photoroom.jpg?w=600",
        price: 74.00,
        description: "Crispy waffle, smoked salmon, spinach and sautéed onions in butter and cheese sauce, sunny-side-up eggs and green onion, served with a salad of your choice.",
        ingredients: [10, 11, 7, { _id: 3, selected: 6 }, 9],
        salads: [0, 1, 2, { _id: 3, price: 15 }],
        sauces: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    },
    {
        _id: 3,
        name: "Greek Morning",
        img: "https://imageproxy.wolt.com/menu/menu-images/shared/e178d684-b2d9-11ee-8482-5e29ceb85658_boker_yevani_photoroom.jpg?w=600",
        price: 67.00,
        description: "Sunny-side up eggs served on cheese and spinach tiropita, with almond skordalia, labneh with olive oil, tomato salsa, ricotta with peppers, and Greek salad. (Served without bread)",
        ingredients: [{ _id: 3, selected: 6 }, 12, 0, 13, 14],
        sauces: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    },
    {
        _id: 4,
        name: "Eggs Benedict",
        img: "https://imageproxy.wolt.com/menu/menu-images/shared/e8222ada-b2d9-11ee-b363-a2e21199740d_benedict_photoroom.jpg?w=600",
        price: 68.00,
        description: "Brioche, spinach, hollandaise, poached eggs, onion jam, green onion and black pepper. Served with a salad of your choice.",
        ingredients: [11, 15, { _id: 3, selected: 7 }, 16, 9, 17],
        adds: [
            { name: "Mushrooms and onions", price: 10 },
            { name: "Smoked salmon", price: 15 }
        ],
        salads: [0, 1, 2, { _id: 3, price: 15 }],
        sauces: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    },
    {
        _id: 5,
        name: "French Brioche",
        img: "https://imageproxy.wolt.com/menu/menu-images/shared/eba59912-b2d9-11ee-a7e8-e664ddb694a7_brish_tsarfati_photoroom.jpg?w=600",
        price: 68.00,
        description: "Brioche, truffle butter, mushroom Alfredo sauce, mozzarella cheese, sunny-side-up eggs and green onion. Served with a personal salad.",
        ingredients: [18, 19, { _id: 3, selected: 6 }, 9],
        salads: [0, 1, 2, { _id: 3, price: 15 }],
        sauces: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    }]




function get_sections_from_section(id) {

    var sectionsId = sections.find(section => section._id == id).child_sections
    if (sectionsId == undefined || sectionsId == null) {
        console.log('No sections found')
        return
    }

    var sectionsArr = []
    sectionsId.forEach((eachId) => {
        var section = sections.find(element => element._id == eachId)
        if (!section) {
            console.log(`Section ${eachId} does not exist`)
        }
        else {
            sectionsArr.push(section)
        }
    })
    return sectionsArr
}

function get_products_from_section(id) {

    var productIds = sections.find(section => section._id == id).products
    
    if (!productIds) {
        return
    }
    var arrProducts = []
    

    productIds.forEach((productId) => {
        var productFound = products.find((product) => product._id == productId)
        if (!productFound) {
            console.log(`The product with the id ${productId} was not found`)
        }
        else {
            arrProducts.push(productFound)
        }
    })

    console.log(arrProducts);
    
    return arrProducts
}


export function get_from_section(id) {


    var sections = get_sections_from_section(id)
    if (sections) {
        return { type: "section", sections }
    }
    console.log('Search products');


    var products = get_products_from_section(id)
    if (products) {
        return { type: "product", products }
    }


}

export function get_previous_section(id) {
    const previousSection = sections.find(section => section.child_sections.includes(id));
    return previousSection._id;
}

export function get_product_section(id) {
    const previousSection = sections.find(section => section.products.includes(id));
    return previousSection._id;
}



