import type { NextPage } from "next";
import { useEffect, useState, useContext } from "react"
import { useRouter } from 'next/router'
import styles from '../styles/Room.module.css';
import { Message } from './Message';
import { Context } from '../context/Context';

interface DataMsg {
   userName: string;
   msg: string;
}

export const Chat: NextPage = () => {
   const router = useRouter()
   const { me, socket } = useContext(Context)
   const [ text, setText ] = useState('')
   const [ messages, setMessages ] = useState<DataMsg[]>([])

   useEffect(() => {
      let { room } = router.query
      console.log(room)
      if(socket && room){
         console.log(me)
         socket.emit('join', room, me)
         socket.on('created', () => console.log("FOI created!!"))
         socket.on('joined', () => console.log("FOI joined!!"))

         socket.on('createMessage', (userName:string, msg:string) =>
            setMessages(currentMsgs => [...currentMsgs, {userName, msg}]))
      }
      return () => {
         socket.off('created')
         socket.off('joined')
         socket.off('createMessage')
      }
   },[router.query])

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
