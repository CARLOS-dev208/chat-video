import { useEffect } from 'react';
import io from 'socket.io-client';

import type { NextPage } from "next";
let socket;
const Home: NextPage = () => {
  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = io();
    socket.on("newIncomingMessage", (msg) => {
      console.log(msg);
    });
  };

  return <h1>Heloo</h1>;
};

export default Home;
