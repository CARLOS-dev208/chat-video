import { useContext, useEffect, useState } from 'react';

import { SocketContext } from '../context/Context';
import styles from '../styles/Room.module.css';
import { RoomUser } from '../types/room-user';

import type { NextPage } from "next";
export const Participants: NextPage = () => {
  const { socket } = useContext(SocketContext);
  const [participantes, setParticipantes] = useState<RoomUser[]>([]);
  useEffect(() => {
    socket.on("participants", (usuarios: RoomUser[]) => {
      console.log(usuarios);
      new Audio("/notification.mp3").play();
      setParticipantes(usuarios)
    });
  }, [socket]);
  return (
    <section className={styles.members__container}>
      <div className={styles.members__header}>
        <p>Participantes</p>
        <strong className={styles.members__count}>{participantes.length}</strong>
      </div>
      <div className={styles.member__list}>
        {participantes.map(({ name, roomId }) => {
          return (
          <div key={roomId} className={styles.member__wrapper}>
            <span className={styles.green__icon}></span>
            <p className={styles.member_name}>{name}</p>
          </div>
          )
        })}
      </div>
    </section>
  );
};
