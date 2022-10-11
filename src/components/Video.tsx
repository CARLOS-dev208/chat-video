import type { NextPage } from "next";
import { useEffect, useRef } from 'react'
import styles from '../styles/Room.module.css'

export const Video: NextPage = ({stream}) => {
   const videoRef = useRef(null)

   useEffect(()=> {
      if(videoRef.current && stream){
         videoRef.current.srcObject = stream
         videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
         };
      }
   },[stream])

   return (
      <div className={styles.video__container}>
         <div className={styles.video__player}>
            <video className={styles.video} autoPlay playsInline ref={videoRef} />
         </div>
      </div>
   );
};
