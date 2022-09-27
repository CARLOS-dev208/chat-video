import { Server, Socket } from 'socket.io';

import { RoomUser } from '../types/room-user';

export function eventsPeer(socket: Socket, io: Server, users: RoomUser[], user: RoomUser) {
    const { room } = user;
    socket.to(room).emit('call', { id: socket.id })

    socket.on('offer', ({id, offer}) => {
        console.log(`${socket.id} offering ${id}`)
        socket.to(id).emit('offer', { id: socket.id, offer })
    })

    socket.on('answer', ({id, answer}) => {
        console.log(`${socket.id} answering ${id}`)
        socket.to(id).emit('answer', { id: socket.id, answer })
    })

    socket.on('candidate', ({id, candidate}) => {
        console.log(`${socket.id} sending a candidate to ${id}`)
        socket.to(id).emit('candidate', { id: socket.id, candidate })
    })

    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`)
        io.emit('disconnect-user', { id: socket.id })
    });
}