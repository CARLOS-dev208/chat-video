import { Server as NetServer } from 'http';
import { Server as ServerIO } from 'socket.io';

import { NextApiResponseServerIO } from '../../types/next';

import type { NextApiRequest} from "next";

export default function SocketHandler(req: NextApiRequest, res: NextApiResponseServerIO) {
  console.log('SocketHandler')
  if (!res.socket.server.io) {
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {path: "/api/socket",});
    io.on("connection", (socket: any) => {
      setInterval(() => socket.emit("teste", "hahha"), 10 * 1000);
    });
    res.socket.server.io = io;
  }
  res.end();
}
