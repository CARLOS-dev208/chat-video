import { Server, Socket } from 'socket.io';

import { Message, RoomUser } from '../types/room-user';

export function escultarEventsChat(socket: Socket, io: Server, users: RoomUser[], room: string) {
    io.to(room).emit("participants", users.filter(user => user.room === room));
    socket.on("message", (message: Message) => io.to(message.room).emit("message", message));
}