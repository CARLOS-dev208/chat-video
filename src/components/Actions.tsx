import { useEffect, useRef, useState, useContext } from 'react';
import styles from '../styles/Room.module.css'
import CameraButton from '../../public/camera.svg'
import FoneButton from '../../public/fone.svg'
import ScreenButton from '../../public/screen.svg'
import LogOutButton from '../../public/log-out.svg'
import type { NextPage } from "next";
import { Context } from '../context/Context';
import { Video } from './Video';

export const Actions: NextPage = () => {
   const { local, remotes, share, fixedScreen, handleShareScreenStart, onPeerLeave } = useContext(Context);

   return (
      <section className={styles.stream__container}>
         <div className={styles.stream__box}></div>
         <div className={styles.streams__container}>
            {fixedScreen && <Video stream={fixedScreen}/>}
            <Video stream={local}/>
            {remotes.map((stream, key) => 
            <Video {...{key, stream}}/>
            )}
         </div>
         <div className={styles.stream__actions}>
            <button>
               <CameraButton />
            </button>
            <button>
               <FoneButton />
            </button>
            <button className={!share ? styles.active : ''}
               onClick={share ? handleShareScreenStart : () => onPeerLeave(null, true)}>
               <ScreenButton />
            </button>
            <button>
               <LogOutButton />
            </button>
         </div>
      </section>
   );
};

