import { Dispatch, SetStateAction } from 'react';
import { Socket } from 'socket.io-client';

import { User } from './User';

export class PeerManager {
    socket: Socket
    users: Map<string, User>;
    stream: MediaStream
    setPeers: Dispatch<SetStateAction<any[]>>
    constructor(users: Map<string, User>, socket: Socket, stream: MediaStream, setPeers: Dispatch<SetStateAction<any[]>>) {
        this.socket = socket;
        this.stream = stream;
        this.users = users;
        this.setPeers = setPeers
        this.startEvents()
    }

    createPeerConnection({ id }: any) {
        const peerConnection = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
        const user = new User(id, peerConnection, this.users)
        this.onIcecandidate(user);
        this.onTrack(user);
        this.stream.getTracks().forEach(track => peerConnection.addTrack(track, this.stream));
        return { peerConnection, user };
    }

    onIcecandidate = ({ id, peerConnection }: User) => {
        peerConnection.onicecandidate = ({ candidate }) => {
            if (candidate) this.socket.emit('candidate', { id: id, candidate });
        }
    }

    onTrack = ({ peerConnection, ...user }: User) => {
        
        peerConnection.ontrack = ({ streams }: RTCTrackEvent) => {
            if (!user.player) {
                this.setPeers(oldStrams => [...oldStrams, streams[0]]);
                user.player = true;
            }
        }
    }

    answerPeer = async (data: any) => {
        const { peerConnection, user } = this.createPeerConnection(data)
        await peerConnection.setRemoteDescription(data.offer);
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        this.socket.emit('answer', { id: user.id, answer })
    }

    createOffer = async (data: any) => {
        const { peerConnection, user } = this.createPeerConnection(data)
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        this.socket.emit('offer', { id: user.id, offer })
    }

    getUser(id: string) {
        return this.users.get(id);
    }

    setRemoteDescription = ({ answer, id }: any) => {
        this.getUser(id)?.setRemoteDescription(answer)
    }

    addIceCandidate = ({ candidate, id }: any) => {
        this.getUser(id)?.addIceCandidate(candidate)
    }

    startEvents() {
        this.socket.on('call', this.createOffer);
        this.socket.on('offer', this.answerPeer);
        this.socket.on('answer', this.setRemoteDescription);
        this.socket.on('candidate', this.addIceCandidate);
        this.socket.on('disconnect-user', this.exit)
    }

    exit = (data: any) => {
        let user = this.getUser(data.id)
        if (user) {
            this.users.delete(data.id)
            user.selfDestroy()
            this.setPeers(oldStrams => oldStrams.filter(({ active }) => active))
        }
    }
}

