import { Server, Socket } from 'socket.io';

import { RoomUser } from '../types/room-user';

export function eventsPeer(socket: Socket, io: Server, user: RoomUser) {
    const { room } = user;
    socket.on('call', () => {
        socket.to(room).emit('call', { id: socket.id })
    })

    socket.on('offer', ({id, offer}) => {
        socket.to(id).emit('offer', { id: socket.id, offer })
    })

    socket.on('answer', ({id, answer}) => {
        socket.to(id).emit('answer', { id: socket.id, answer })
    })

    socket.on('candidate', ({id, candidate}) => {
        socket.to(id).emit('candidate', { id: socket.id, candidate })
    })
}