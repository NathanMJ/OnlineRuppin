const tables = [{
    id: 3,
    orders: [0,1],
    link_id: 1234
},
{
    id: 4,
    orders: [2,3,4],
    link_id: 1235
},
{
    id: 5,
    orders: [28,29],
    link_id: 1111
}]


export const order = {
    img: 'https://images.immediate.co.uk/production/volatile/sites/30/2013/05/Aubergine-and-sesame-noodles-6138de6.jpg?quality=90&resize=556,505',
    name: 'Spaghettis',
    status: "In preparation",
    colorStatus: 'orange'
}


export async function getTableIdWithLinkId(linkId){
    const res = tables.find(table => table.link_id == linkId)
    if(res){
        return res.id
    }
    else {
        return 
    }
}

export async function getOrdersWithTableId(tableId) {
    
    const table = tables.find(tempTable => tempTable.id === tableId);
    if (!table || !table.orders) {
        return ;
    }
    const returnOrders = table.orders;
    console.log('get orders');
    return returnOrders;
}