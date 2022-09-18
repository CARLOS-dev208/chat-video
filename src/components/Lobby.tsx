import { useRouter } from 'next/router';

import ArrowButton from '../../public/arrow.svg';
import styles from '../styles/Lobby.module.css';

import type { NextPage } from "next";
export const Lobby: NextPage = () => {
    const router = useRouter();
    async function handleSubmit(e: any) {
        e.preventDefault();
        const { name, room } = e.target;
        const res = await fetch('/api/generate-uuid');
        const roomId = await res.json();
        const obj = {
            name: name.value,
            room: room.value,
            roomId
        }
        localStorage.setItem("usuario", JSON.stringify(obj))
        router.push(`/${room.value}`)
    }
    return (
        <main id="room__lobby__container">
            <div className={styles.form__container}>
                <div className={styles.form__container__header}>
                    <p>👋 Create or Join Room</p>
                </div>
                <form onSubmit={handleSubmit} className={styles.lobby__form}>
                    <div className={styles.form__field__wrapper}>
                        <label>Your Name</label>
                        <input type="text" name="name" required placeholder="Enter your display name..." />
                    </div>
                    <div className={styles.form__field__wrapper}>
                        <label>Room Name</label>
                        <input type="text" name="room" required placeholder="Enter room name..." />
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

