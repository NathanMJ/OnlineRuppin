import { useEffect, useState } from 'react'
import './App.css'

function App() {



  const [orderPannelIsOpen, setOrderPannelIsOpen] = useState(false)


  //TODO: set the orders work
  //TODO: research product by name container
  //TODO: set the colors dynamic
  //TODO: set the dinner logo dynamic
  //TODO: set the change langage working to see result

  const [languagePannelOpen, setLanguagePannelOpen] = useState(true)

  const languageAvaibles = [
    'french',
    'english'
  ]

  return (
    <div className='table-page'>
      <div className={`orders-pannel ${orderPannelIsOpen ? 'open' : 'close'}`}>
        <div className='pannel-closer' onClick={() => setOrderPannelIsOpen(!orderPannelIsOpen)}>
          <p className='notification-counter'></p>
          <img src={`${!orderPannelIsOpen ? 'opened' : 'closed'}_eye.png`} />
        </div>

        <div className='background'>
          <div className='coloration'></div>
        </div>

        <div className='orders-side-container'>
          <div className='top'>
            <h1>Orders :</h1>
          </div>
          <div className="orders"></div>
          <div className='bottom'>

            <button className='action-btn'>Order everythings</button>
            <p className='total-price-orders'>Total : 20 ₪</p>
          </div>
        </div>
      </div>

      <div className='menu-side'>
        <header>
          <div className='left-side'>
            <div className="top">

              <button className='connect-button'>Connect</button>
              <img className='QR-code' src='https://images.seeklogo.com/logo-png/21/1/qr-code-logo-png_seeklogo-217342.png' />
            </div>
            <div className='bottom'>
              <button className='help-btn'>Ask waiter</button>
            </div>
          </div>

          <div className='dinner-logo-container'>
            <img alt="dinner_logo" src="https://i.pinimg.com/736x/07/61/f5/0761f5d95faebc413b17579f00ce5aa2.jpg" />
          </div>

          <div className="right-side">

            <div className='top'>

              <div className='ai-waiter-container'>
                <img alt="ai_waiter" src='./ai_waiter.png' />
                <p>AI Waiter</p>
              </div>

              <div className="research-container">
                <img alt="research-logo" src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Magnifying_glass_icon.svg/768px-Magnifying_glass_icon.svg.png' />
                <input maxLength={15} size={12} type="text" placeholder='Search a product' className='research-field' />
              </div>

            </div>
            <div className="bottom"></div>
          </div>
        </header>

        <div className='menu-container'>
          <div className="menu"></div>
        </div>
      </div>
      <div className='flyings-btns'>
        <button className='tutorial'>?</button>
        <div className="change-language-container">
          <img src="translate_icon.png" alt="translate-icon"
            onClick={() => { setLanguagePannelOpen(!languagePannelOpen) }} />
          <div className={`other-languages-icons 
            ${languagePannelOpen ? 'open' : 'close'}`}>
            {languageAvaibles.map(l => {
              return <div>
                <img src={`${l}_icon.png`} />
                <p>{l}</p>
              </div>
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
