import React, { useState } from 'react'
import ReturnButton from '../FComponents/ReturnButton';
import { useMessageContext } from '../Contexts/messageContext';
import { socket } from '../App';

export default function ManagerSendMessageToTables() {

    const [customMessage, setCustomMessage] = useState({ text: 'The restaurant is closing in 20 minutes', type: 'info', duration: 5000 })
    /* message : text, type, duration in Ms */
    const [predefinedMessages, setPredefinedMessage] = useState([
        { text: 'The kitchen is closing in 20 minutes', type: 'info', duration: 5000 },
        { text: 'The restaurant is closing now', type: 'warning', duration: 10000 }])
    const { addMessage } = useMessageContext();



    /*
        TODO:
            get the customs message from the db
            send the message to the tables
    */

    const sentMessage = (e, message) => {
        e.preventDefault()
        const messageToSend = {...message}
        if (messageToSend.duration == 20000)
            messageToSend.duration = 'infinite'

        //TODO: be able to choose to send to a table or everytable
        //send message to every table
        socket.emit('broadcast:allTables', messageToSend);

        addMessage(messageToSend.text, messageToSend.type, messageToSend.duration)
    }

    return (
        <div className='sendMessageToTables'>
            <h1>Sent a custom message</h1>
            <form onSubmit={(e) => { sentMessage(e, customMessage) }}>
                <div>
                    <p>Your message :</p>
                    <input type="text"
                        value={customMessage.text}
                        placeholder='Write your text'
                        onChange={(e) => setCustomMessage((prevS) => ({ ...prevS, text: e.target.value }))} />
                </div>
                <div>
                    <select 
                    value={customMessage.type} onChange={(e) => setCustomMessage((prevS) => ({ ...prevS, type: e.target.value }))}>
                        <option value="info">Info</option>
                        <option value="success">Success</option>
                        <option value="error">Error</option>
                        <option value="warning">Warning</option>
                    </select>
                </div>
                <div>
                    <div>
                        <p>Duration in second :</p>
                        <p>{customMessage.duration != 20000 ? customMessage.duration / 1000 + ' sec' : 'infinite'}</p>
                    </div>
                    <input type="range" min={5000} max={20000} step={1000}
                        onChange={(e) => setCustomMessage((prevS) => ({ ...prevS, duration: e.target.value }))} />
                </div>
                <button type="submit">Send Message</button>
            </form>
            <h1>Pick a predefined message</h1>
            {predefinedMessages.map(m => {
                return <div className='predefinedMessage' onClick={() => setCustomMessage(m)}>
                    <p>{m.text}</p>
                    <p>{m.duration}</p>
                </div>
            })}

            <ReturnButton position={'fixed'} bottom={'10px'} left={'10px'}></ReturnButton>
        </div>
    )
}
