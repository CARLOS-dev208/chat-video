import {
    createContext,
    Dispatch,
    MutableRefObject,
    ReactNode,
    SetStateAction,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { io, Socket } from 'socket.io-client';

import { PeerManager } from '../connections/Peer';
import { User } from '../connections/User';
import { RoomUser } from '../types/room-user';


type ContextProviderProps = {
    children: ReactNode;
};
type ContextData = {
    socket: Socket,
    me: RoomUser | null,
    stream: MediaStream | null
    mediaStreamRef: MutableRefObject<HTMLVideoElement | null>;
    peers: any[];
    sharing: boolean,
    setSharing: Dispatch<SetStateAction<boolean>>;
    handleShareScreenStart: () => void;
    handleShareScreenStop: () => void;
    stopCamareOrAudio: (key: string) => void;
};
const users = new Map<string, User>();
let stateMyStream: MediaStream | null = null;
const constraints = { audio: { echoCancellation: true, noiseSuppression: true }, video: { width: 300, height: 300 } };
const SocketContext = createContext({} as ContextData);
const ContextProvider = ({ children }: ContextProviderProps) => {
    const socket = useMemo(() => io({ path: "/api/socket" }), []);
    const [me, setMe] = useState<RoomUser | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);    
    const [peers, setPeers] = useState<any[]>([]);
    const [sharing, setSharing] = useState(false)
    const mediaStreamRef = useRef<HTMLVideoElement | null>(null);
    useEffect(() => {
        getUserMedia().then((stream) => {
            new PeerManager(users, socket, stream, setPeers)
            setStream(stream)
            const me = JSON.parse(localStorage.getItem('usuario')!);
            socket.emit("select_room", me);
            socket.emit("call");
            setMe(me)
        })
        return () => { socket.disconnect() }
    }, [socket]);

    const getUserMedia = (): Promise<MediaStream> => {
        return navigator.mediaDevices.getUserMedia(constraints)
    }

    const replaceTrack = (peer: RTCPeerConnection, track: any) => {
        const sender = peer.getSenders().find(sender => sender.track?.kind === track?.kind);
        if (!sender) {
            console.warn('failed to find sender');
            return;
        }
        sender.replaceTrack(track);
    }


    const handleShareScreenStart = () => {
        stateMyStream = stream;
        navigator.mediaDevices.getDisplayMedia({ audio: true, video: true })
            .then((stream) => {
                users.forEach(session => replaceTrack(session.peerConnection, stream.getVideoTracks()[0]));
                stream.getVideoTracks().map(track => track.onended = () => handleShareScreenStop());
                setStream(stream)
            })
            .catch((err) => console.log(err));
    }

    const handleShareScreenStop = () => {
        users.forEach(session => replaceTrack(session.peerConnection, stateMyStream?.getVideoTracks()[0]))
        setStream(stateMyStream)
        setSharing(false)
    }

    const stopCamareOrAudio = (key: string) => {
        if (key === 'CAMERA') {
            const video = stream?.getVideoTracks()[0]
            if (video) video.enabled = !video.enabled
        } else if (key === 'FONE') {
            const audio = stream?.getAudioTracks()[0]
            if (audio) audio.enabled = !audio.enabled
        }
    }


    return (
        <SocketContext.Provider
            value={{
                me,
                peers,
                socket,
                stream,
                sharing,
                mediaStreamRef,
                setSharing,
                stopCamareOrAudio,
                handleShareScreenStop,
                handleShareScreenStart,
            }}>
            {children}
        </SocketContext.Provider>
    );
};

export { ContextProvider, SocketContext };
