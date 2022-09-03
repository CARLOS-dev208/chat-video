import { Server } from "socket.io";

import type { NextApiRequest, NextApiResponse } from "next";
export default function SocketHandler(req: NextApiRequest, res: any) {
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on("connection", (socket: any) => {
    console.log(socket.id);

    setInterval(() => socket.emit("newIncomingMessage", "teste"), 20 * 1000);
  });
  res.end();
}
