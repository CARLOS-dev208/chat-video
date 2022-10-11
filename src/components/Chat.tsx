import type { NextPage } from "next";
import { useEffect, useState, useContext } from "react"
import styles from '../styles/Room.module.css';
import { Message } from './Message';
import { Context } from '../context/Context';

interface DataMsg {
   userName: string;
   msg: string;
}

export const Chat: NextPage = () => {
   const [ text, setText ] = useState('')
   const { socket, me, messages } = useContext(Context);
   
   const handleText = (e:any) => {
      if(e.key === "Enter") {
         e.preventDefault();
         if(text.length){
            socket.emit("message", text);
            setText("")
         }
      }
   }

   return (
      <section className={styles.messages__container}>
         <div className={styles.messages}>
            {messages.map(({userName, msg}, index) => 
            <Message key={index} me={me === userName} username={userName} msg={msg}/>
         )}
      </div>
      <form className={styles.message__form}>
         <input type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyPress={handleText}
            placeholder="Send a message...." />
      </form>
   </section>
);
};
