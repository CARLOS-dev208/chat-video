import { useEffect, useRef } from 'react';

import styles from '../styles/Room.module.css';

import type { NextPage } from "next";
type Props = {
  stream: MediaStream | null;
  muted?: boolean
}
export const Stream: NextPage<Props> = ({ stream, muted = true }) => {
  const videoRef = useRef<HTMLVideoElement | null>();
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])
  return (
      <div className={styles.video__container}>
        <div className={styles.video__player}>
          <video
            className={styles.video}
            autoPlay
            muted={muted}
            ref={(ref) => (videoRef.current = ref)}
          />
        </div>
      </div>
  );
};

