import { useContext } from 'react';

import { SocketContext } from '../context/Context';
import styles from '../styles/Room.module.css';
import { Stream } from './Stream';

import type { NextPage } from "next";
export const Video: NextPage = () => {
  const { peers, mediaStreamRef, stream, sharing } = useContext(SocketContext);
  return (
    <>
      <section className={sharing ? styles.stream__box : styles.stream__box_none}>
        <video autoPlay ref={mediaStreamRef} />
      </section>
      <div className={styles.streams__container}>
        <Stream key={stream?.id} stream={stream} muted={true} />
        {peers.map((stream) => <Stream key={stream.id} stream={stream} muted={false} />)}
      </div>
    </>
  );
};
