import { Actions } from '../components/Actions';
import { Chat } from '../components/Chat';
import { Header } from '../components/Header';
import { Participants } from '../components/Participants';
import styles from '../styles/Room.module.css';

import type { NextPage } from "next";
const Room: NextPage = () => {
  return (
    <>
    <Header/>
    <main className={styles.container}>
      <div className={styles.room__container}>
        <Participants />
        <Actions />
        <Chat />
      </div>
    </main>
    </>
  );
};

export default Room;