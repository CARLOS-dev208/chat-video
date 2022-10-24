import { useContext, useRef } from 'react';

import CameraButton from '../../public/camera.svg';
import FoneButton from '../../public/fone.svg';
import LogOutButton from '../../public/log-out.svg';
import ScreenButton from '../../public/screen.svg';
import { SocketContext } from '../context/Context';
import styles from '../styles/Room.module.css';
import { Video } from './Video';

import type { NextPage } from "next";
export const Actions: NextPage = () => {
  const {sharing, handleShareScreenStart, handleShareScreenStop, stopCamareOrAudio } = useContext(SocketContext);
  const caremaRef = useRef<HTMLButtonElement | null>(null);
  const foneRef = useRef<HTMLButtonElement | null>(null);
  function toggleCarema(key: string)  {
      const events: any = {
        'CAMERA': caremaRef.current,
        'FONE': foneRef.current,
      }
      const event = events[key];
      if(event){
        event.classList.toggle('active');
        stopCamareOrAudio(key)
      }
  }
  return (
    <section className={styles.stream__container}>
      <Video></Video>
      <div className={styles.stream__actions}>
        <button onClick={() => toggleCarema('CAMERA')} ref={caremaRef}>
          <CameraButton />
        </button>
        <button onClick={() => toggleCarema('FONE')} ref={foneRef}>
          <FoneButton />
        </button>
        <button onClick={!sharing ? handleShareScreenStart : handleShareScreenStop} className={sharing ? 'active' : ''}>
          <ScreenButton />
        </button>
        <button onClick={() => toggleCarema('SAIR')}>
          <LogOutButton />
        </button>
      </div>
    </section>
  );
};

