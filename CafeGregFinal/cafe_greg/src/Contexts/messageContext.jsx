import React, { createContext, useContext, useState, useRef } from 'react';

// Créer le contexte
const MessageContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useMessageContext = () => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error('useMessageContext must be used within a MessageProvider');
    }
    return context;
};

// Provider du contexte
export const MessageProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const timeoutsRef = useRef(new Map());

    const addMessage = (text, type = 'info', duration = 5000) => {
        const id = Date.now() + Math.random();
        const newMessage = { id, text, type };

        setMessages(prev => [...prev, newMessage]);

        // Programmer la suppression automatique
        if (duration > 0) {
            const timeout = setTimeout(() => {
                removeMessage(id);
            }, duration);
            timeoutsRef.current.set(id, timeout);
        }
    };

    const removeMessage = (id) => {
        setMessages(prev => prev.filter(msg => msg.id !== id));
        const timeout = timeoutsRef.current.get(id);
        if (timeout) {
            clearTimeout(timeout);
            timeoutsRef.current.delete(id);
        }
    };

    const clearMessages = () => {
        // Nettoyer tous les timeouts
        timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
        timeoutsRef.current.clear();
        setMessages([]);
    };

    const value = {
        messages,
        addMessage,
        removeMessage,
        clearMessages
    };

    return (
        <MessageContext.Provider value={value} >
            {children}

            {/* Container de messages global */}
            {messages.length > 0 && (
                <div className="messagesContextContainer">
                    {messages.map(message => (
                        <div
                            key={message.id}
                            className={`message ${getMessageStyle(message.type)}`}
                        >
                            <p className="text">{message.text}</p>
                            <button
                                onClick={() => removeMessage(message.id)}
                                className="remover"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </MessageContext.Provider>
    );
};

// Fonction helper pour les styles
const getMessageStyle = (type) => {
    switch (type) {
        case 'success':
            return 'bg-green-50 border-green-500 text-green-800';
        case 'error':
            return 'bg-red-50 border-red-500 text-red-800';
        case 'warning':
            return 'bg-yellow-50 border-yellow-500 text-yellow-800';
        case 'info':
        default:
            return 'bg-blue-50 border-blue-500 text-blue-800';
    }
};