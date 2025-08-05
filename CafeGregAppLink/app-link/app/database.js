import { fetchCustomerByTableId, fetchOrdersWithTableId, fetchTableIdFromServer, 
    servLoginCustomer, servRegisterCustomer, fetchSections, servOrderProductById,
    servChangeOrderStatus,
    servCancelOrder,
    fetchProductsThatContains,
    sercDisconnectCustomer} from './linkToServer.js'


export async function getTableIdWithLinkId(linkId) {
    const tableId = await fetchTableIdFromServer(linkId)
    return tableId
}

export async function getOrdersByTableId(tableId) {
    const orders = await fetchOrdersWithTableId(tableId)
    return orders
}


export async function getCustomersByTableId(tableId) {
    const customers = await fetchCustomerByTableId(tableId)
    return customers
}

export async function registerCustomer(customer, tableId) {
    const msg = await servRegisterCustomer(customer, Number(tableId))
    if (msg)
        return msg
    else
        return
}


export async function loginCustomer(customerId, tableId) {
    const msg = await servLoginCustomer(customerId, Number(tableId))
    if (msg)
        return msg
    else
        return F
}


export async function getSections() {
    const sections = await fetchSections()
    return sections;
}


export async function orderProductById(productId, tableId) {
    const statusId = await servOrderProductById(Number(productId), Number(tableId))
    
    return statusId
}



export async function getProductByName(name) {
    const products = await fetchProductsThatContains(name)
    console.log('product',products);  
    return products
}

export async function getProductById(productId) {
    return products.find(product => product.id == productId)
}



export async function sendOrder(orderId) {    
    const res = await servChangeOrderStatus(orderId, 1)
    return res
}

export async function cancelOrder(orderId) {    
    const res = await servCancelOrder(orderId, 1)
    return res
}

export async function disconnectCustomer(customerId) {
    await sercDisconnectCustomer(customerId)
    return    
}