import { Dispatch, SetStateAction } from 'react';
import { Socket } from 'socket.io-client';

import { User } from './User';

export const createPeer = (user: User, socket: Socket, myStream: MediaStream, setPeers: Dispatch<SetStateAction<any[]>>) => {
    const peerConnection = new RTCPeerConnection({iceServers: [{ urls: 'stun:stun.l.google.com:19302'}]})
    peerConnection.onicecandidate = ({candidate}) => {
        if(!candidate) return;
        socket.emit('candidate', { id: user.id, candidate})
    }
    myStream?.getTracks().forEach(track => peerConnection.addTrack(track, myStream));
    peerConnection.ontrack =  ({streams}: RTCTrackEvent) => {
        if (user.player) return;
        setPeers(oldStrams => [...oldStrams, streams[0]])
        user.player = true;
    }
    peerConnection.ondatachannel =  ({channel}: RTCDataChannelEvent) => {
        user.dc = channel
        setupDataChannel(channel)
    }
    return peerConnection
}


export const createOffer = async (user: User, socket: Socket) => {
    user.dc = user.pc.createDataChannel('chat')
    setupDataChannel(user.dc)
    const offer: RTCSessionDescriptionInit = await user.pc.createOffer();
    await user.pc.setLocalDescription(offer);
    socket.emit('offer', {id: user.id, offer})
}

export const answerPeer = async (user: User, offer: RTCSessionDescriptionInit, socket: Socket) => {
    await user.pc.setRemoteDescription(offer);
    const answer: RTCSessionDescriptionInit = await user.pc.createAnswer();
    await  user.pc.setLocalDescription(answer);
    socket.emit('answer', {id: user.id, answer})
}

const setupDataChannel = (dataChannel: RTCDataChannel) => {
    dataChannel.onopen = checkDataChannelState
    dataChannel.onclose = checkDataChannelState
    // dataChannel.onmessage = (e: any) => addMessage(e.data);
}

const checkDataChannelState = (dataChannel: any) => console.log('WebRTC channel state is:', dataChannel.type);
