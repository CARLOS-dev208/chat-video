import type { NextApiRequest } from "next";
import type { NextApiResponseServerIO } from "../../types/next";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";

export default async (req: NextApiRequest, res: NextApiResponseServerIO) => {
   if (!res?.socket.server.io) {
      console.log("New Socket.io server...");
      // adapt Next's net Server to http Server
      const httpServer: NetServer = res.socket.server as any;
      const io = new ServerIO(httpServer, {
         path: "/api/socket",
      });

      // append SocketIO server to Next.js socket server response
      res.socket.server.io = io;

      io.on("connection", (socket) => {
         var currentRoom, me;
         socket.on("join", (roomName, userName) => {
            console.log(`User Connected: ${socket.id}`);
            const {rooms} = io.sockets.adapter;
            const room = rooms.get(roomName);

            socket.join(roomName);
            socket.emit("joined", socket.id, !room);

            me = userName
            currentRoom = roomName
         });
         
         socket.on("message", (message) => {
            io.to(currentRoom).emit("createMessage", me, message);
         });

         socket.on("ready", () => {
            socket.to(currentRoom).emit("ready", socket.id, me); // Informs the other peer in the room.
         });

         socket.on("offer", (id, offer) => {
            socket.to(id).emit("offer", socket.id, me, offer); // Sends Offer to the other peer in the room.
         });

         socket.on("answer", (id, answer) => {
            socket.to(id).emit("answer", socket.id, answer); // Sends Answer to the other peer in the room.
         });

         socket.on("ice-candidate", (id, candidate) => {
            //console.log(candidate);
            socket.to(id).emit("ice-candidate", socket.id, candidate); // Sends Candidate to the other peer in the room.
         });

         socket.on('disconnect', () => {
            socket.leave(currentRoom);
            socket.broadcast.to(currentRoom).emit("leave", socket.id);
         })
      });
   }
   res.end();
};
