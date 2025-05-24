const tables = [
    {
        id: 3,
        orders: [0, 1],
        link_id: 1234
    },
    {
        id: 4,
        orders: [2, 3, 4],
        link_id: 1235
    },
    {
        id: 5,
        orders: [28, 29],
        link_id: 1111
    }]

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

export async function getProductById(productId) {
    return products.find(product => product.id == productId)
    
}

export async function getSections() {
    return sections;
}

export async function getTableIdWithLinkId(linkId) {
    const res = tables.find(table => table.link_id == linkId)
    if (res) {
        return res.id
    }
    else {
        return
    }
}

export async function getOrdersWithTableId(tableId) {

    const table = tables.find(tempTable => tempTable.id === tableId);
    if (!table || !table.orders) {
        return;
    }
    const returnOrders = table.orders;
    console.log('get orders');
    return returnOrders;
}