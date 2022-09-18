import styles from '../styles/Room.module.css';
import { Message as Msg } from '../types/room-user';

import type { NextPage } from "next";
type Props = {
  mensagem: Msg
}
export const Message: NextPage<Props> = ({mensagem}) => {
  return (
    <div className={styles.message__wrapper}>
      <div className={styles.message__body}>
        <strong className={styles.message__author}>{mensagem.name}</strong>
        <p className={styles.message__text}>{mensagem.message}</p>
      </div>
    </div>
  );
};

