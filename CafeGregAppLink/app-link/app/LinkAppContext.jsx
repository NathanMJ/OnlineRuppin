import { createContext, useState } from "react";
import React from "react";

export const LinkAppContext = createContext(null)

export default function LinkAppProvider({ children }) {
    const [linkApp, setLinkApp] = useState({ tableId: null })

    return (<LinkAppContext.Provider value={{linkApp, setLinkApp}} >
        {children}
    </LinkAppContext.Provider>)
}

