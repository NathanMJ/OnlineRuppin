import React, { createContext, useContext, useRef, useState } from 'react';
import { useMessageContext } from './messageContext.jsx';
import { getWorkerByIdFromDB } from '../connectToDB.js';

// Créer le contexte
const IdContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useIdContext = () => {
  const context = useContext(IdContext);
  if (!context) {
    throw new Error('useIdContext must be used within an IdProvider');
  }
  return context;
};

// Provider du contexte
export const IdProvider = ({ children }) => {
  const { addMessage } = useMessageContext();

  const askIdRef = useRef(null);
  const [askIdContainer, setAskIdContainer] = useState({
    show: false,
    id: ''
  });

  const getWorkerById = async (profile, title = "Enter your ID:") => {
    return new Promise((resolve, reject) => {
      setAskIdContainer((prevS) => ({ ...prevS, show: true, id: '', title, profile }));
      askIdRef.current = { resolve, reject };
    });
  };

  const validateId = async () => {
    if (askIdRef.current && askIdContainer.id.trim()) {
      const id = askIdContainer.id.trim();
      setAskIdContainer({ show: false, id: '', title: '' });
      const res = await getWorkerByIdFromDB(askIdContainer.profile, id);
      if (!res.ok) {
        addMessage("Worker not found", "error", 5000);
        askIdRef.current.reject({ message: res.message } );
      }
      askIdRef.current.resolve(res);
    }
    askIdRef.current = null;
  };

  const cancel = async () => {
    if (askIdRef.current) {
      askIdRef.current.reject({ message: 'User cancelled the ID input' });
      setAskIdContainer({ show: false, id: '', title: '' });
      askIdRef.current = null;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      validateId();
    } else if (e.key === 'Escape') {
      cancel();
    }
  };

  const value = {
    getWorkerById,
    validateId,
    cancel,
    handleKeyPress,
    askIdContainer
  };

  return (
    <IdContext.Provider value={value}>
      {children}

      {/* Modal global */}
      {askIdContainer.show && (
        <div className="modal-overlay">
          <div className="askIdContextContainer">
            <h1>{askIdContainer.title || "Enter your ID:"}</h1>
            <input
              type="text"
              value={askIdContainer.id}
              onChange={(e) => setAskIdContainer((prevS) => ({ ...prevS, id: e.target.value }))}
              onKeyDown={handleKeyPress}
              placeholder="Enter ID here..."
              autoFocus
            />
            <div className="buttonContainer">
              <button
                onClick={validateId}
                className="validate"
                disabled={!askIdContainer.id.trim()}
              >
                Validate
              </button>
              <button onClick={cancel} className="cancel">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </IdContext.Provider>
  );
};
