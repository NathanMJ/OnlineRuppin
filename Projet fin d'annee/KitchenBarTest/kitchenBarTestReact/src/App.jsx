import { useState } from 'react'
import './App.css'
import BarKitchenOrder from './FuncComps/BarKitchenOrder'

function App() {

  const [orders, setOrders] = useState(
    [
      {
        name: 'NameOrder1', pictureLink: 'https://images.immediate.co.uk/production/volatile/sites/30/2013/05/Aubergine-and-sesame-noodles-6138de6.jpg?quality=90&resize=556,505', startTime: new Date().setHours(10, 55, 38, 0),
        changes:
        {
          adds: ['extra salmon', 'ketchup', 'white bread'],
          subs: ['cucumber', 'tomato']
        }
      },
      
      {
        name: 'NameOrder2', pictureLink: 'https://img.hellofresh.com/f_auto,fl_lossy,q_auto,w_1200/hellofresh_s3/image/HF_Y23_M_W27_UK_03_3_low-6510a59e.jpg', startTime: new Date().setHours(10, 55, 38, 0),
        changes:
        {
          adds: ['ketchup', 'white bread'],
          subs: ['salmon', 'tomato']
        }
      },
      
      {
        name: 'NameOrder3', pictureLink: 'link', startTime: new Date().setHours(10, 55, 38, 0),
        changes:
        {
          adds: ['mayonnaise', 'blue bread'],
          subs: ['cucumber']
        }
      }
    ]
  )

  return (
    <>
      <div className='barKitchenPage'>
        <BarKitchenOrder order={orders[0]}></BarKitchenOrder>
        <BarKitchenOrder order={orders[1]}></BarKitchenOrder>
        <BarKitchenOrder order={orders[2]}></BarKitchenOrder>
      </div>
    </>
  )
}

export default App
