import styles from '../styles/Room.module.css'
import CameraButton from '../../public/camera.svg'
import FoneButton from '../../public/fone.svg'
import ScreenButton from '../../public/screen.svg'
import LogOutButton from '../../public/log-out.svg'
import type { NextPage } from "next";
export const Actions: NextPage = () => {
  return (
    <section id={styles.stream__container}>
      <div className={styles.stream__actions}>
        <button>
          <CameraButton />
        </button>
        <button className={styles.active}>
          <FoneButton />
        </button>
        <button>
          <ScreenButton />
        </button>
        <button>
          <LogOutButton />
        </button>
      </div>
    </section>
  );
};

