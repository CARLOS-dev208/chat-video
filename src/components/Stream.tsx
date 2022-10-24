import { useContext, useEffect, useRef, useState } from 'react';

import { SocketContext } from '../context/Context';
import styles from '../styles/Room.module.css';

import type { NextPage } from "next";
type Props = {
  stream: MediaStream | null;
  muted?: boolean
}
export const Stream: NextPage<Props> = ({ stream, muted = true }) => {
  const { mediaStreamRef, setSharing } = useContext(SocketContext);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  function fixVideo() {
    if (mediaStreamRef.current && stream) {
      mediaStreamRef.current.srcObject = stream
      setSharing(true)
    }
  }

  return (
    <div className={styles.video__container}>
      <div className={styles.video__player}>
        <video
          onClick={fixVideo}
          className={styles.video}
          autoPlay
          muted={muted}
          ref={videoRef}
        />
      </div>
    </div>
  )
};

