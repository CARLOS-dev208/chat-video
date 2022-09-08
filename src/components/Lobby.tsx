import styles from '../styles/Lobby.module.css';
import ArrowButton from '../../public/arrow.svg'
import type { NextPage } from "next";
import { useRouter } from 'next/router';
export const Lobby: NextPage = () => {
    const router = useRouter()
    return (
        <main id="room__lobby__container">
            <div className={styles.form__container}>
                <div className={styles.form__container__header}>
                    <p>👋 Create or Join Room</p>
                </div>
                <form className={styles.lobby__form}>
                    <div className={styles.form__field__wrapper}>
                        <label>Your Name</label>
                        <input type="text" name="name" required placeholder="Enter your display name..." />
                    </div>
                    <div className={styles.form__field__wrapper}>
                        <label>Room Name</label>
                        <input type="text" name="room" required placeholder="Enter room name..." />
                    </div>
                    <div className={styles.form__field__wrapper}>
                        <button type="submit" onClick={() => router.push('/room')}>Go to Room
                            <ArrowButton />
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

