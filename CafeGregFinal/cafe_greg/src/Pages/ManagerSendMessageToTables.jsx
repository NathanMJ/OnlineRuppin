import React, { useState } from 'react'
import ReturnButton from '../FComponents/ReturnButton';

export default function ManagerSendMessageToTables() {

    const [customMessage, setCustomMessage] = useState({ test: '', type: 'info', duration: 5 })
    /* message : text, type, duration in Ms */

    /*
        TODO:
            get the customs message from the db
            send the message to the tables
            add the possibility to set an infinity message, can close with the arrow
    
    */

    const sentMessage = (e, message) => {
        e.preventDefault()
        console.log(message);
    }

    return (
        <div>
            <h1>Sent a custom message</h1>
            <form onSubmit={(e) => { sentMessage(e, customMessage) }}>
                <div>
                    <p>Your message :</p>
                    <input type="text" placeholder='Write your text'
                        onChange={(e) => setCustomMessage((prevS) => ({ ...prevS, text: e.target.value }))} />
                </div>
                <div>
                    <select defaultValue={customMessage.type} onChange={(e) => setCustomMessage((prevS) => ({ ...prevS, type: e.target.value }))}>
                        <option value="info">Info</option>
                        <option value="success">Success</option>
                        <option value="error">Error</option>
                        <option value="warning">Warning</option>
                    </select>
                </div>
                <div>
                    <div>
                        <p>Duration in second :</p>
                        <p>{customMessage.duration != 20 ? customMessage.duration + ' sec': 'infinite'}</p>
                    </div>
                    <input type="range" min={5} max={20} step={1} defaultValue={5}
                        onChange={(e) => setCustomMessage((prevS) => ({ ...prevS, duration: e.target.value }))} />
                </div>
                <button type="submit">Send Message</button>
            </form>
            <ReturnButton bottom={'10px'} left={'10px'}></ReturnButton>
        </div>
    )
}
