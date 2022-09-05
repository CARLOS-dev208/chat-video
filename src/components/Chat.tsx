import styles from '../styles/Room.module.css';

import type { NextPage } from "next";
export const Chat: NextPage = () => {
  return (
    <section className={styles.messages__container}>
      <div className={styles.messages}>
        <div className={styles.message__wrapper}>
          <div className={styles.message__body__bot}>
            <strong className={styles.message__author__bot}>🤖 Mumble Bot</strong>
            <p className={styles.message__text__bot}>Welcome to the room, a be shy, say hello!</p>
          </div>
        </div>
        <div className={styles.message__wrapper}>
          <div className={styles.message__body}>
            <strong className={styles.message__author}>Carlos 👋</strong>
            <p className={styles.message__text}>Does
              anyone know hen he will be
              back?</p>
          </div>
        </div>
      </div>
      <form className={styles.message__form}>
        <input type="text" name="message" placeholder="Send a message...." />
      </form>
    </section>
  );
};

