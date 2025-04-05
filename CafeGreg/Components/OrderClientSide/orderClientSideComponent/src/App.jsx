import { useState } from 'react'
import './App.css'
import FCOrderClientSide from './FCOrderClientSide'


function App() {
  const [count, setCount] = useState(0)
  const [orders, setOrders] = useState(
    [
      { 
        name : 'Name of the order',
        status : 'ordered',
        price : 25 ,
        time: '12:00:12',
        src : 'https://images.immediate.co.uk/production/volatile/sites/30/2013/05/Aubergine-and-sesame-noodles-6138de6.jpg?quality=90&resize=556,505',
      addSubs : [ 
        {status : '+' , name : 'cucumber', price : 20} ,
        {status : '+' , name : 'carrot', price : null},
        {status : '-' , name : 'tomato', price : null }
      ]
    }
    ]
  )
  return (
    <>
      <FCOrderClientSide order={orders[0]}></FCOrderClientSide>
    </>
  )
}

export default App
