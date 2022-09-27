import { Server as NetServer } from 'http';
import { Server as ServerIO, Socket } from 'socket.io';

import { NextApiResponseServerIO } from '../../types/next';
import { RoomUser } from '../../types/room-user';
import { escultarEventsChat } from '../../util/socketChat';
import { eventsPeer } from '../../util/socketPeer';

import type { NextApiRequest } from "next";
export default function SocketHandler(
   req: NextApiRequest,
   res: NextApiResponseServerIO
) {
   console.log("SocketHandler");
   if (!res.socket.server.io) {
      const httpServer: NetServer = res.socket.server as any;
      const io = new ServerIO(httpServer, { path: "/api/socket" });
      io.on("connection", (socket: Socket) => eventSource(io, socket));
      res.socket.server.io = io;
   }
   res.end();
}

const users: RoomUser[] = [];
function eventSource(io: ServerIO, socket: Socket) {
   socket.on("select_room", (user: RoomUser) => {
      socket.join(user.room);
      const userInRoom = users.find(({ roomId }) => roomId === user.roomId);
      if (userInRoom) {
         userInRoom.socketId = socket.id;
      } else {
         users.push({ ...user, socketId: socket.id });
      }
      escultarEventsChat(socket, io, users, user);
      eventsPeer(socket, io, users, user)
   });
}
