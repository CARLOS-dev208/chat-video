import { createContext, MutableRefObject, ReactNode, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

import { RoomUser } from '../types/room-user';


type ContextProviderProps = {
    children: ReactNode;
};
type ContextData = {
    socket: Socket,
    me: RoomUser | null,
    myVideo: MutableRefObject<HTMLVideoElement | null | undefined>;
    stream: MediaStream | null
};
const constraints = { audio: true, video: { width: 300, height: 300 } };
const SocketContext = createContext({} as ContextData);
const ContextProvider = ({ children }: ContextProviderProps) => {
    const socket = useMemo(() => io({ path: "/api/socket" }), []);
    const [me, setMe] = useState<RoomUser | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const myVideo = useRef<HTMLVideoElement | null>();
    useEffect(() => {
        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            setStream(stream)
            const me = JSON.parse(localStorage.getItem('usuario')!);
            socket.emit("select_room", me);
            setMe(me)
        });
        return () => { socket.disconnect() }
    }, [socket]);
    return (
        <SocketContext.Provider value={{ socket, me, myVideo, stream }}>
            {children}
        </SocketContext.Provider>
    );
};

export { ContextProvider, SocketContext };
