import { useContext } from 'react';

import { Header } from '../components/Header';
import { Lobby } from '../components/Lobby';
import { SocketContext } from '../context/Context';

import type { NextPage } from "next";
const Home: NextPage = () => {
  useContext(SocketContext);
  return (
    <>
      <Header />
      <Lobby />
    </>
  );
};

export default Home;
