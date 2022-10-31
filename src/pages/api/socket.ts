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

         socket.on("ready-sharing", () => {
            socket.to(currentRoom).emit("ready", socket.id, me, true); // Informs the other peer in the room.
         });

         socket.on("ready", () => {
            socket.to(currentRoom).emit("ready", socket.id, me); // Informs the other peer in the room.
         });

         socket.on("offer", (id, offer, sharing) => {
            socket.to(id).emit("offer", socket.id, me, offer, sharing); // Sends Offer to the other peer in the room.
         });

         socket.on("answer", (id, answer, sharing) => {
            socket.to(id).emit("answer", socket.id, answer, sharing); // Sends Answer to the other peer in the room.
         });

         socket.on("ice-candidate", (id, candidate, sharing) => {
            //console.log(candidate);
            socket.to(id).emit("ice-candidate", socket.id, candidate, sharing); // Sends Candidate to the other peer in the room.
         });

         socket.on("leave", (sharing) => {
            socket.to(currentRoom).emit("leave", socket.id, sharing)
         });

         socket.on('disconnect', () => {
            socket.leave(currentRoom);
            socket.broadcast.to(currentRoom).emit("leave", socket.id);
         })
      });
   }
   res.end();
};
