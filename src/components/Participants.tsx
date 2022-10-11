import type { NextPage } from "next";
import styles from '../styles/Room.module.css'
import { useContext } from "react"
import { Context } from '../context/Context';

export const Participants: NextPage = () => {
   const { participants } = useContext(Context);

   return (
      <section className={styles.members__container}>
         <div className={styles.members__header}>
            <p>Participantes</p>
            <strong className={styles.members__count}>{participants.size}</strong>
         </div>
         <div className={styles.member__list}>
            {[...participants].map((participant) =>
            <div key={participant[0]} className={styles.member__wrapper}>
               <span className={styles.green__icon}></span>
               <p className={styles.member_name}>{participant[1]}</p>
            </div>
            )}
         </div>
      </section>
   );
};
