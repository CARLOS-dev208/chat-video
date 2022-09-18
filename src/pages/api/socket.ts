import { Server as NetServer } from 'http';
import { Server as ServerIO, Socket } from 'socket.io';

import { NextApiResponseServerIO } from '../../types/next';
import { RoomUser } from '../../types/room-user';
import { escultarEventsChat } from '../../util/socketChat';

import type { NextApiRequest } from "next";
export default function SocketHandler(
   req: NextApiRequest,
   res: NextApiResponseServerIO
) {
   console.log("SocketHandler");
   if (!res.socket.server.io) {
      const httpServer: NetServer = res.socket.server as any;
      const io = new ServerIO(httpServer, { path: "/api/socket" });
      eventSource(io);
      res.socket.server.io = io;
   }
   res.end();
}

const users: RoomUser[] = [];
function eventSource(io: ServerIO) {
   io.on("connection", (socket: Socket) => {
      socket.on('select_room', (data: RoomUser) => {
         socket.join(data.room);
         const userInRoom = users.find(({roomId}) => roomId === data.roomId);
         if(userInRoom){
            userInRoom.socketId = socket.id;
         } else{
            users.push({...data, socketId: socket.id})
         }
         escultarEventsChat(socket, io, users, data.room);
      })
   });
}
