import { createContext, ReactNode, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io({ path: "/api/socket" });             
type ContextProviderProps = {
    children: ReactNode;
};
type ContextData = {
    startCountdown: () => void;
};
const SocketContext = createContext({} as ContextData);

const ContextProvider = ({ children }: ContextProviderProps) => {
    useEffect(() => {
        socket.on("teste", (e) => console.log(e));
    }, []);
    return (
        <SocketContext.Provider value={{ startCountdown: () => {}}}>
            {children}
        </SocketContext.Provider>
    );
};

export { ContextProvider, SocketContext };
