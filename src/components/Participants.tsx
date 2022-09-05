import styles from '../styles/Room.module.css'
import type { NextPage } from "next";
export const Participants: NextPage = () => {
  return (
    <section className={styles.members__container}>
      <div className={styles.members__header}>
        <p>Participantes</p>
        <strong className={styles.members__count}>27</strong>
      </div>
      <div className={styles.member__list}>
        <div className={styles.member__wrapper}>
          <span className={styles.green__icon}></span>
          <p className={styles.member_name}>Carlos</p>
        </div>
      </div>
    </section>
  );
};

