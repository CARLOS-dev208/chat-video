import { Header } from '../components/Header';
import { Lobby } from '../components/Lobby';


import type { NextPage } from "next";
const Home: NextPage = () => {
  return (
    <>
      <Header />
      <Lobby />
    </>
  );
};

export default Home;
