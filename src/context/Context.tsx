import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { io, Socket } from 'socket.io-client';

import { RoomUser } from '../types/room-user';


type ContextProviderProps = {
    children: ReactNode;
};
type ContextData = {
    socket: Socket,
    me: RoomUser
};
const SocketContext = createContext({} as ContextData);
const ContextProvider = ({ children }: ContextProviderProps) => {
    const [me, setMe] = useState<RoomUser>({} as RoomUser);
    const socket = useMemo(() => io({ path: "/api/socket" }), []);
    useEffect(() => {
        const me = JSON.parse(localStorage.getItem('usuario')!);
        socket.emit("select_room", me);
        setMe(me)
        console.log('Context: ', socket);
        return () => {
            console.log('disconnect: ', socket)
            socket.disconnect();
        }
    }, [socket]);
    return (
        <SocketContext.Provider value={{socket, me}}>
            {children}
        </SocketContext.Provider>
    );
};

export { ContextProvider, SocketContext };
