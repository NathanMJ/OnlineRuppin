import React, { createContext, useContext, useRef, useState } from 'react';

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
  const askIdRef = useRef(null);
  const [askIdContainer, setAskIdContainer] = useState({
    show: false,
    id: ''
  });

  const getWorkerId = async (title = "Enter your ID:") => {
    return new Promise((resolve, reject) => {
      setAskIdContainer((prevS) => ({ ...prevS, show: true, id: '', title }));
      askIdRef.current = { resolve, reject };
    });
  };

  const validateId = async () => {
    if (askIdRef.current && askIdContainer.id.trim()) {
      const id = askIdContainer.id.trim();
      askIdRef.current.resolve(id);
      setAskIdContainer({ show: false, id: '', title: '' });
      askIdRef.current = null;
      return id;
    }
  };

  const cancel = async () => {
    if (askIdRef.current) {
      askIdRef.current.reject(new Error('User cancelled ID entry'));
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
    getWorkerId,
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
