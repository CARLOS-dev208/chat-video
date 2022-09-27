import CameraButton from '../../public/camera.svg';
import FoneButton from '../../public/fone.svg';
import LogOutButton from '../../public/log-out.svg';
import ScreenButton from '../../public/screen.svg';
import styles from '../styles/Room.module.css';
import { Video } from './Video';

import type { NextPage } from "next";
export const Actions: NextPage = () => {
  function toggleCarema(e: any)  {
    console.log(e); 
  }
  return (
    <section className={styles.stream__container}>
      <Video></Video>
      <div className={styles.stream__actions}>
        <button onClick={toggleCarema}>
          <CameraButton />
        </button>
        <button className={styles.active} onClick={toggleCarema}>
          <FoneButton />
        </button>
        <button onClick={toggleCarema}>
          <ScreenButton />
        </button>
        <button onClick={toggleCarema}>
          <LogOutButton />
        </button>
      </div>
    </section>
  );
};

