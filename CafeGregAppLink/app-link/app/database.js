const tables = [{
    id: 1,
    orders: [0,1,2,3]
}]

const links = [
    {
        id: 1234,
        table_id: 15
    }
]

export const order = {
    img: 'https://images.immediate.co.uk/production/volatile/sites/30/2013/05/Aubergine-and-sesame-noodles-6138de6.jpg?quality=90&resize=556,505',
    name: 'Spaghettis',
    status: "In preparation"
}


export async function getTableIdWithLinkId(linkId){
    const res = links.find(link => link.id == linkId)
    if(res){
        return res.table_id
    }
    else {
        return false
    }
}

export async function getOrdersWithTableLinkId(linkId) {
    // Find the link by linkId
    const link = links.find(link => link.id === linkId);
    if (!link) {
        return { status: 0 };
    }
    // Find the table by table_id from the link
    const table = tables.find(tempTable => tempTable.id === link.table_id);
    if (!table || !table.orders) {
        return { status: 0 };
    }
    const returnOrders = table.orders;
    return { status: 1, returnOrders };
}