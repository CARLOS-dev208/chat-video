import { Server as NetServer } from 'http';
import { Server as ServerIO } from 'socket.io';

import { NextApiResponseServerIO } from '../../types/next';

import type { NextApiRequest} from "next";

export default function SocketHandler(req: NextApiRequest, res: NextApiResponseServerIO) {
  console.log('SocketHandler')
  if (!res.socket.server.io) {
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {path: "/api/socket",});
    eventSource(io)
    res.socket.server.io = io;
  }
  res.end();
}

function eventSource(io: ServerIO){
  io.on("connection", (socket: any) => {
    console.log(`connection - ${socket.id}`)
    socket.join('room1')
    setInterval(() => socket.to('room1').emit("teste", socket.id), 10 * 1000);
  });
}