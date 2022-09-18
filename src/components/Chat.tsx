import { KeyboardEvent, useContext, useEffect, useState } from 'react';

import { SocketContext } from '../context/Context';
import styles from '../styles/Room.module.css';
import { Message as Msg } from '../types/room-user';
import { Message } from './Message';

import type { NextPage } from "next";
export const Chat: NextPage = () => {
  const [message, setMessage] = useState("");
  const [mensagens, setMensagens] = useState<Msg[]>([]);
  const { socket, me } = useContext(SocketContext);
  useEffect(() => {
    socket.on('message', (mensagem: Msg) => setMensagens(currentMsgs => [...currentMsgs, mensagem]))
  }, [socket])
  function handleKeyDown(e: KeyboardEvent) {
    if (e.code === "Enter") {
      e.preventDefault();
      socket.emit('message', {...me, message})
      setMessage("");
    }
  }
  return (
    <section className={styles.messages__container}>
      <div className={styles.messages}>
        {mensagens.map((msg, index) => <Message key={index} mensagem={msg} />)}
      </div>
      <form className={styles.message__form}>
        <input
          type="text"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Send a message...."
        />
      </form>
    </section>
  );
};
