import type { NextPage, GetServerSideProps } from "next";
import { useState, useEffect, useCallback } from "react"
import { Actions } from '../components/Actions';
import { Chat } from '../components/Chat';
import { Header } from '../components/Header';
import { Participants } from '../components/Participants';
import styles from '../styles/Room.module.css';
import ContextProvider from '../context/Context';

const Room: NextPage = ({room}) => {
   return (
      <ContextProvider {...{room}}>
         <Header/>
         <main className={styles.container}>
            <div className={styles.room__container}>
               <Participants />
               <Actions/>
               <Chat/>
            </div>
         </main>
      </ContextProvider>
   );
};

export const getServerSideProps: GetServerSideProps = async ({params:{room}}) => {
   return {
      props: {room} 
   }
}

export default Room;
