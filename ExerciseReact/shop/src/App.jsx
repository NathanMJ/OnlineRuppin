import { useState } from 'react'
import './App.css'
import CCShop from './ClassComps/CCShop.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <CCShop/>
      </div>
    </>
  )
}

export default App
