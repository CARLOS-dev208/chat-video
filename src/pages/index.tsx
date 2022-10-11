import type { NextPage } from "next";
import { Header } from '../components/Header';
import { Lobby } from '../components/Lobby';
/*import { useContext } from "react"
import { Context } from '../context/Context';*/

const Home: NextPage = () => {
   //const { socket } = useContext(Context)

   return (
      <>
      <Header/>
      <Lobby/>
      </>
   );
};

export default Home;
