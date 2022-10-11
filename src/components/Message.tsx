import type { NextPage } from "next";
import styles from '../styles/Room.module.css';

type Props = {
   me: boolean,
   username: string,
   msg: string
}

export const Message: NextPage<Props> = ({me, username, msg}) => {
   return (
      <div className={styles.message__wrapper}>
         <div className={styles[`${me ? 'message__body' : 'message__body__bot'}`]}>
            <strong className={styles[`${me ? 'message__author' : 'message__author__bot'}`]}>{username}</strong>
            <p className={styles[`${me ? 'message__text' : 'message__text__bot'}`]}>{msg}</p>
         </div>
      </div>
   )
}
