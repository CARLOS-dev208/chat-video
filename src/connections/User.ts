export class User {
    id: string;
    player: any;
    pc: any;
    dc!: RTCDataChannel;
    
    constructor(id: string) {
        this.id = id;
    }

    selfDestroy() {
        this.player && this.player.remove();
        if (this.pc) {
            this.pc.close()
            this.pc.onicecandidate = null
            this.pc.ontrack = null
            this.pc = null
        }
    }

    sendMessage(message: string) {
        this.dc && this.dc.send(message)
    }
}