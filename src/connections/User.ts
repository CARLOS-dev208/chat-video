export class User {
    id: string;
    player: any;
    peerConnection: RTCPeerConnection;

    constructor(id: string, peerConnection: RTCPeerConnection, users = new Map<string, User>()) {
        this.id = id;
        this.peerConnection = peerConnection;
        users.set(id, this)
    }

    selfDestroy() {
        if (this.peerConnection) {
            this.peerConnection.close()
            this.peerConnection.onicecandidate = null
            this.peerConnection.ontrack = null
        }
    }

    setRemoteDescription(answer: RTCSessionDescriptionInit) {
        this.peerConnection.setRemoteDescription(answer)
    }

    addIceCandidate(candidate: RTCIceCandidate) {
        this.peerConnection.addIceCandidate(candidate)
    }
}