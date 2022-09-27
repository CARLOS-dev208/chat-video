import { useContext, useEffect, useRef, useState } from 'react';

import { answerPeer, createOffer, createPeer } from '../connections/Peer';
import { User } from '../connections/User';
import { SocketContext } from '../context/Context';
import styles from '../styles/Room.module.css';
import { Stream } from './Stream';

const map = new Map<string, User>();
import type { NextPage } from "next";
export const Video: NextPage = () => {
  const { socket, myVideo, stream } = useContext(SocketContext);
  const [peers, setPeers] = useState<any[]>([]);

  useEffect(() => {
    if (stream) {
      socket.on('call', (data) => {
        const user = new User(data.id)
        user.pc = createPeer(user, socket, stream!, setPeers)
        map.set(data.id, user)
        createOffer(user, socket)
      });
      
      socket.on('offer', (data) => {
        const user = map.get(data.id)
        if (user) {
          answerPeer(user, data.offer, socket)
        } else {
          let user = new User(data.id)
          user.pc = createPeer(user, socket, stream!, setPeers)
          map.set(data.id, user)
          answerPeer(user, data.offer, socket)
        }
      });

      socket.on('answer', (data) => {
        const user = map.get(data.id)
        if (user) user.pc.setRemoteDescription(data.answer);
      });

      socket.on('candidate', function (data) {
        const user = map.get(data.id)
        if (user) {
          user.pc.addIceCandidate(data.candidate)
        } else {
          const user = new User(data.id)
          user.pc = createPeer(user, socket, stream!, setPeers)
          user.pc.addIceCandidate(data.candidate)
          map.set(data.id, user)
        }
      });
    }
  }, [socket, stream]);
  return (
    <>
      <div className={styles.stream__box}></div>
      <div className={styles.streams__container}>
          <Stream key={0} stream={stream} muted={true} />
          {peers.map((stream, index) => <Stream key={index + 1} stream={stream} />)}
      </div>
    </>
  );
};
