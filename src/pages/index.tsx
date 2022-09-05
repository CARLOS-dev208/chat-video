import { Header } from '../components/Header';

import type { NextPage } from "next";
import { Lobby } from '../components/Lobby';
const Home: NextPage = () => {
  return (
    <>
      <Header/>
      <Lobby/>
    </>
  );
};

export default Home;
