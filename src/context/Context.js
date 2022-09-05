import { createContext, useEffect } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext({teste: 'teste'});

const socket = io({ path: "/api/socket" });
socket.on("teste", () => console.log("teste"));

const ContextProvider = ({ children }) => {
    useEffect(() => {
        console.log("useEffect");
    }, []);
    return (
        <SocketContext.Provider value={{ teste: "" }}>
            {children}
        </SocketContext.Provider>
    );
};

export { ContextProvider, SocketContext };
