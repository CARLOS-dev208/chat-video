export type RoomUser = {
    name: string,
    room: string,
    roomId: string,
    socketId: string
};


export type Message = {
    message: string
} & RoomUser