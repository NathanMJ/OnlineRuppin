import { createContext, useState } from "react";
import React from "react";

const LinkAppContext = createContext(null)

export default function LinkAppProvider({ children }) {
    const [linkApp, setLinkApp] = useState({ tableId: null })

    return (<LinkAppContext.Provider>
        {children}
    </LinkAppContext.Provider>)
}

