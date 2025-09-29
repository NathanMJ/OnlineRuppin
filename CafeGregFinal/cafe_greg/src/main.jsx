import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { IdProvider } from './Contexts/askIdContext.jsx'
import { MessageProvider } from './Contexts/messageContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <MessageProvider>
      <IdProvider>
        <App />
      </IdProvider>
    </MessageProvider>
  </BrowserRouter>
)
