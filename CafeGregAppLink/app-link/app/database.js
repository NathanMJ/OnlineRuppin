import { fetchTableIdFromServer } from './linkToServer.js'

const tables = [
    {
        id: 3,
        orders: [0, 1],
        link_id: 1234
    },
    {
        id: 4,
        orders: [2],
        link_id: 1235
    }
]

const orders = [
    {
        id: 0,
        product: 0,
        status: 1
    },
    {
        id: 1,
        product: 3,
        status: 0
    },
    {
        id: 2,
        product: 1,
        status: 1
    }
]

const status = [
    {
        id: 0,
        status: 'Pending',
        backgroundColor: 'red',
        color: 'white'
    },
    {
        id: 1,
        status: 'Ordered',
        backgroundColor: 'green',
        color: 'white'
    }
]

const sections = [
    {
        id: 0,
        name: 'Starters',
        products: [0, 1, 2],
        img: 'https://images.immediate.co.uk/production/volatile/sites/30/2021/03/French-fries-b9e3e0c.jpg'
    }, {
        id: 1,
        name: 'Meals',
        products: [3, 4],
        img: 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/mealprep-pasta-merged_web3_copy-6087bd8.jpg?quality=90&resize=500,454'
    }, {
        id: 2,
        name: 'Desserts',
        products: [5, 6],
        img: 'https://www.foodandwine.com/thmb/ckc6L6xKox0WfpfO6dMkuVGPQOY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Angel-Food-Cake-with-Three-Berry-Compote-FT-RECIPE0323-541a780b871441e0ab14383ee38acc44.jpg'
    }]

const products = [
    // Starters
    {
        id: 0,
        img: 'https://www.simplyorganic.com/media/recipe/resized/520x520/wysiwyg/tmp/simply-oragnic-Roasted-Tomato-Bruschetta-1080x1080-thumbnail.jpg',
        name: 'Bruschetta',
        price: 7.50
    },
    {
        id: 1,
        img: 'https://www.onceuponachef.com/images/2023/06/greek-salad-1-1200x1477.jpg',
        name: 'Greek Salad',
        price: 6.00
    },
    {
        id: 2,
        img: 'https://www.ambitiouskitchen.com/wp-content/uploads/2023/02/Garlic-Bread-4.jpg',
        name: 'Garlic Bread',
        price: 5.00
    },

    // Meals
    {
        id: 3,
        img: 'https://img.taste.com.au/5qlr1PkR/taste/2016/11/spaghetti-bolognese-106560-1.jpeg',
        name: 'Spaghetti Bolognese',
        price: 12.50
    },
    {
        id: 4,
        img: 'https://foodal.com/wp-content/uploads/2020/04/Bright-Light-and-Lemony-30-Minute-Pasta-with-Grilled-Chicken.jpg',
        name: 'Grilled Chicken Pasta',
        price: 13.00
    },

    // Desserts
    {
        id: 5,
        img: 'https://tutti-dolci.com/wp-content/uploads/2024/04/Triple-Chocolate-Brownies-3.jpg',
        name: 'Chocolate Brownie',
        price: 6.00
    },
    {
        id: 6,
        img: 'https://sugarspunrun.com/wp-content/uploads/2023/06/Strawberry-cheesecake-recipe-6-of-8.jpg',
        name: 'Strawberry Cheesecake',
        price: 6.50
    }
]

export async function getTableIdWithLinkId(linkId) {
    
    const res2 = await fetchTableIdFromServer(linkId)
    console.log('res2', res2);
        
    if (res2) {
        return res2
    }
    else {
        return
    }
}


export function orderProductById(productId, tableId) {
    const orderId = (orders.length > 0 ? Math.max(...orders.map(order => order.id)) : -1) + 1;
    const order = { id: orderId, product: productId, status: 0 }
    orders.push(order)
    const table = tables.find(t => t.id === tableId);
    if (!table) {
        throw new Error(`Table with id ${tableId} not found`);
    }
    if (table.orders && table.orders.length > 0) {
        table.orders.push(orderId)
    }
    else {
        table.orders = [orderId]
    }
}

export async function getProductById(productId) {
    return products.find(product => product.id == productId)
}

export async function getSections() {
    return sections;
}

export async function getOrdersWithTableId(tableId) {

    const table = tables.find(tempTable => tempTable.id === tableId);
    if (!table || !table.orders) {
        return;
    }
    const ordersId = table.orders;

    const returnOrders = ordersId.map(orderId => {
        const orderIndex = orders.findIndex(order => order.id == orderId)
        const tempOrder = orders[orderIndex]
        const orderStatus = { ...status.find(temp => temp.id == tempOrder.status) }
        const productOrder = { ...products.find(product => product.id == tempOrder.product) }
        delete productOrder.id
        const { status: _, product, ...orderWithout } = tempOrder;
        console.log({ ...orderWithout, status: orderStatus, ...productOrder });
        
        return { ...orderWithout, status: orderStatus, ...productOrder }
    })

    return returnOrders;
}

export async function changeOrderStatus(orderId, newStatus) {
    const indexOrder = orders.findIndex(order => order.id == orderId)
    orders[indexOrder].status = newStatus
    return orders[indexOrder].status
}

export async function cancelOrder(orderId, tableId) {
    //cancel the order in orders array
    const indexOrderInOrders = orders.findIndex(order => order.id == orderId);
    if (indexOrderInOrders !== -1) {
        orders.splice(indexOrderInOrders, 1);
    }

    //cancel the order in the table
    const indexTable = tables.findIndex(table => table.id == tableId)

    const indexOrderInTable = tables[indexTable].orders.findIndex(order => order == orderId)

    if (indexOrderInTable !== -1) {
        tables[indexTable].orders.splice(indexOrderInTable, 1)
    }
    return;
}