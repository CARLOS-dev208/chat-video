import React, { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/router'
import io from 'socket.io-client';

const Context = React.createContext()

var socket;
const ICE_SERVERS = {iceServers: [{urls: 'stun:stun.l.google.com:19302'}]};
const MediaProps = { audio: true, video: { width: 500, height: 500 } };
const SESSIONS = new Map();
const participants = new Map();

const ContextProvider = ({ children, room}) => {
   const router = useRouter();
   const [local, setLocal] = useState()
   const [remotes, setRemotes] = useState([])
   const [messages, setMessages] = useState([])
   const [sharing, setSharing] = useState(false)
   const userStreamRef = useRef();
   const mediaStreamRef = useRef();

   if(typeof localStorage !== 'undefined'){
      var me = localStorage.getItem('userName')
   }

   useEffect(() => {
      socket = io({path: '/api/socket'});

      socket.emit('join', room, me)

      socket.on('joined', handleRoom)
      socket.on('ready', initiateCall);
      socket.on('offer', handleReceivedOffer);
      socket.on('answer', handleAnswerOffer);
      socket.on('ice-candidate', handlerNewIceCandidateMsg);
      socket.on('leave', onPeerLeave);

      socket.on('createMessage', (userName, msg) => {
         setMessages(oldMsgs => [...oldMsgs, {userName, msg}])
      })

      return () => { socket.disconnect(); }
   }, [])

   const handleRoom = (id, host) => {
      navigator.mediaDevices.getUserMedia(MediaProps)
         .then((stream) => {
            userStreamRef.current = stream;
            if(!local) setLocal(stream);
            if(!host) socket.emit('ready');
            participants.set(id, me)
         })
         .catch((err) => {
            console.log(err)
         });
   };

   const createPeerConnection = (id) => {
      const connection = new RTCPeerConnection(ICE_SERVERS);
      connection.onicecandidate = (event) => {
         if (event.candidate) socket.emit('ice-candidate', id, event.candidate);
      } 
      userStreamRef.current?.getTracks()
         .forEach(track => connection.addTrack(track, userStreamRef.current));
      connection.ontrack = (event) => {
         setRemotes(oldRemotes => {
            if(!oldRemotes.find(stream => stream.id == event.streams[0].id)){
               return [...oldRemotes, event.streams[0]]
            }
            return oldRemotes
         })
      };
      return connection;
   };

   const initiateCall = (id, userName) => {
      console.log("Call!")
      let SESSION = {}
      SESSION.rtc = createPeerConnection(id);
      SESSION.rtc.createOffer().then((offer) => {
         SESSION.rtc.setLocalDescription(offer);
         socket.emit('offer', id, offer);
      }).catch((error) => {console.log(error);});
      SESSIONS.set(id, SESSION)
      participants.set(id, userName)
   };

   const handleReceivedOffer = (id, userName, offer) => {
      console.log("Offer!")
      let SESSION = SESSIONS.get(id)
      if(SESSION){
         handleAnswerPeer(id, SESSION, offer)
      }else{
         SESSION = {}
         SESSION.rtc = createPeerConnection(id);
         SESSIONS.set(id, SESSION)
         handleAnswerPeer(id, SESSION, offer)
      }
      participants.set(id, userName)
   };

   const handleAnswerPeer = (id, SESSION, offer) => {
      SESSION.rtc.setRemoteDescription(offer);
      SESSION.rtc.createAnswer()
         .then((answer) => {
            SESSION.rtc.setLocalDescription(answer);
            socket.emit('answer', id, answer);
         })
         .catch((error) => {
            console.log(error);
         });
   }

   const handleAnswerOffer = (id, answer) => {
      let SESSION = SESSIONS.get(id)
      if(SESSION){
         SESSION.rtc.setRemoteDescription(answer).catch((err) => console.log(err));
         if(mediaStreamRef.current){
            replaceTrack(SESSION.rtc, mediaStreamRef.current.getVideoTracks()[0])
         }
      }
   };

   const handlerNewIceCandidateMsg = (id, candidate) => {
      let SESSION = SESSIONS.get(id)
      if(SESSION){
         SESSION.rtc.addIceCandidate(candidate).catch((e) => console.log(e));
      }else{
         let SESSION = {} 
         SESSION.rtc = createPeerConnection(id);
         SESSION.rtc.addIceCandidate(candidate).catch((e) => console.log(e));
         SESSIONS.set(id, SESSION)
      }
   };

   const onPeerLeave = (id) => {
      let SESSION = SESSIONS.get(id)
      if (SESSION) {
         SESSION.rtc.ontrack = null;
         SESSION.rtc.onicecandidate = null;
         SESSION.rtc.close();
         SESSIONS.delete(id)
         participants.delete(id)
      }
      setRemotes(oldRemotes => oldRemotes.filter(remote => remote.active))
   }
   
   const handleShareScreenStart = () => {
      navigator.mediaDevices.getDisplayMedia()
         .then((stream) => {
            [...SESSIONS.values()].map(session => replaceTrack(session.rtc, stream.getVideoTracks()[0]))
            stream.getVideoTracks().map(track => track.onended = () => handleShareScreenStop())
            mediaStreamRef.current = stream;
            setLocal(stream)
            setSharing(true)
         })
         .catch((err) => {
            console.log(err)
         });
   }

   const handleShareScreenStop = () => {
      [...SESSIONS.values()].map(session => replaceTrack(session.rtc, userStreamRef.current?.getVideoTracks()[0]))
      setLocal(userStreamRef.current)
      mediaStreamRef.current?.getTracks().map(track => track.stop())
      mediaStreamRef.current = null
      setSharing(false)
   }

   const replaceTrack = (peer, track) => {
      const sender = peer.getSenders().find(sender => sender.track.kind === track.kind);
      if (!sender) {
         console.warn('failed to find sender');
         return;
      }
      sender.replaceTrack(track);
   }

   return (
      <Context.Provider value={{
         socket,
         participants,
         local,
         remotes,
         messages,
         me,
         room,
         sharing,
         handleShareScreenStart,
         handleShareScreenStop
      }}>
         {children}
      </Context.Provider>
   )
}

export default ContextProvider;
export { Context }
