import { Server, Socket } from 'socket.io';

import { Message, RoomUser } from '../types/room-user';

export function escultarEventsChat(socket: Socket, io: Server, users: RoomUser[], user: RoomUser) {
    const { room } = user;
    io.to(room).emit("participants", users.filter(user => user.room === room));
    socket.on("message", (message: Message) => socket.to(room).emit('message', message));
    
}