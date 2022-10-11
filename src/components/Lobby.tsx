import type { NextPage } from "next";
import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Lobby.module.css';
import ArrowButton from '../../public/arrow.svg'

export const Lobby: NextPage = () => {
   const router = useRouter()
   const [ inputs, setInputs ] = useState({
      userName: '',
      room: ''
   })

   const getDataInput = (e:any) => {
      setInputs({...inputs, [e.target.name]: e.target.value})
   }
   
   const sendData = (e:any) => {
      e.preventDefault();
      let { userName, room } = inputs
      localStorage.setItem("userName", userName)
      router.push(`/${room}`)
   }

   return (
        <main id="room__lobby__container">
            <div className={styles.form__container}>
                <div className={styles.form__container__header}>
                    <p>👋 Create or Join Room</p>
                </div>
                <form className={styles.lobby__form} onSubmit={sendData}>
                    <div className={styles.form__field__wrapper}>
                        <label>Your Name</label>
                        <input type="text" value={inputs.userName} onChange={e => getDataInput(e)} name="userName" required placeholder="Enter your display name..." />
                    </div>
                    <div className={styles.form__field__wrapper}>
                        <label>Room Name</label>
                        <input type="text" value={inputs.room} onChange={e => getDataInput(e)} name="room" required placeholder="Enter room name..." />
                    </div>
                    <div className={styles.form__field__wrapper}>
                        <button type="submit">Go to Room
                            <ArrowButton />
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};
