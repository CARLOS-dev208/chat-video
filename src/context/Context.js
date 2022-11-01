import React, { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/router'
import io from 'socket.io-client';

const Context = React.createContext()

var socket;
const ICE_SERVERS = {iceServers: [{urls: 'stun:stun.l.google.com:19302'}]};
const MediaProps = { audio: true, video: { width: 500, height: 500 } };
const SESSIONS = new Map();
var SESSION_SHARING;
const participants = new Map();

const ContextProvider = ({ children, room}) => {
   const router = useRouter();
   const [local, setLocal] = useState()
   const [remotes, setRemotes] = useState([])
   const [messages, setMessages] = useState([])
   const [share, setShare] = useState(true)
   const [fixedScreen, setFixedScreen] = useState()
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
            setLocal(stream);
            if(!host) socket.emit('ready');
            participants.set(id, me)
         })
         .catch((err) => {
            console.log(err)
         });
   };

   const createPeerConnection = (id, sharing) => {
      const connection = new RTCPeerConnection(ICE_SERVERS);
      connection.onicecandidate = (event) => {
         if (event.candidate) socket.emit('ice-candidate', id, event.candidate, sharing);
      }
      let streamRef = (sharing && mediaStreamRef.current) ?
         mediaStreamRef.current : userStreamRef.current
      streamRef?.getTracks().forEach(track => {
         track.onended = () => onPeerLeave(id, sharing);
         connection.addTrack(track, streamRef)
      });
      connection.ontrack = (event) => {
         event.streams[0]?.getTracks().forEach(track => {
            track.onended = () => {
               setRemotes(oldRemotes => oldRemotes.filter(remote => remote.active))
            }
         })
         if(sharing && (mediaStreamRef.current?.id == event.streams[0].id || !mediaStreamRef.current)){
            setFixedScreen(event.streams[0])
         }else{
            setRemotes(oldRemotes => {
               if(event.streams[0].active 
                  && !oldRemotes.find(stream => stream.id == event.streams[0].id)){
                  return [...oldRemotes, event.streams[0]]
               }
               return oldRemotes
            })
         }
      };
      return connection;
   };

   const initiateCall = (id, userName, sharing) => {
      console.log("Call!")
      let SESSION = createPeerConnection(id, sharing);
      SESSION.createOffer().then((offer) => {
         SESSION.setLocalDescription(offer);
         socket.emit('offer', id, offer, sharing);
      }).catch((error) => {console.log(error);});
      if(!sharing){
         SESSIONS.set(id, SESSION)
         participants.set(id, userName)
         if(mediaStreamRef.current){
            initiateCall(id, userName, true)
         }
      }else{
         SESSION_SHARING = SESSION
      }
   };

   const handleReceivedOffer = (id, userName, offer, sharing) => {
      console.log("Offer!")
      let SESSION = !sharing ? SESSIONS.get(id) : SESSION_SHARING
      if(SESSION){
         handleAnswerPeer(id, SESSION, offer, sharing)
      }else{
         SESSION = createPeerConnection(id, sharing);
         handleAnswerPeer(id, SESSION, offer, sharing)
         if(!sharing){
            SESSIONS.set(id, SESSION)
         }else{
            SESSION_SHARING = SESSION
         }
      }
      participants.set(id, userName)
   };

   const handleAnswerPeer = (id, SESSION, offer, sharing) => {
      SESSION.setRemoteDescription(offer);
      SESSION.createAnswer()
         .then((answer) => {
            SESSION.setLocalDescription(answer);
            socket.emit('answer', id, answer, sharing);
         })
         .catch((error) => {
            console.log(error);
         });
   }

   const handleAnswerOffer = (id, answer, sharing) => {
      let SESSION = !sharing ? SESSIONS.get(id) : SESSION_SHARING
      if(SESSION){
         SESSION.setRemoteDescription(answer).catch((err) => console.log(err));
      }
   };

   const handlerNewIceCandidateMsg = (id, candidate, sharing) => {
      let SESSION = !sharing ? SESSIONS.get(id) : SESSION_SHARING
      if(SESSION){
         SESSION.addIceCandidate(candidate).catch((e) => console.log(e));
      }else{
         SESSION = createPeerConnection(id, sharing);
         SESSION.addIceCandidate(candidate).catch((e) => console.log(e));
         if(!sharing){
            SESSIONS.set(id, SESSION)
         }else{
            SESSION_SHARING = SESSION
         }
      }
   };

   const onPeerLeave = (id, sharing) => {
      console.log("Leave")
      let SESSION = !sharing ? SESSIONS.get(id) : SESSION_SHARING
      if (SESSION) {
         SESSION.ontrack = null;
         SESSION.onicecandidate = null;
         SESSION.close();
         if(!sharing){
            SESSIONS.delete(id)
            participants.delete(id)
         }else{
            fixedScreen?.getTracks().forEach(track => track.stop());
            SESSION_SHARING = null
            mediaStreamRef.current = null
            setFixedScreen(null)
            socket.emit('leave', socket.id)
            setShare(true)
         }
      }
   }
   
   const handleShareScreenStart = () => {
      if(mediaStreamRef.current) { onPeerLeave(null, true); }
      navigator.mediaDevices.getDisplayMedia()
         .then((stream) => {
            mediaStreamRef.current = stream;
            setFixedScreen(stream)
            socket.emit('ready-sharing')
            setShare(false)
         })
         .catch((err) => {
            console.log(err)
         });
   }

   return (
      <Context.Provider value={{
         socket,
         participants,
         local,
         remotes,
         share,
         mediaStreamRef,
         fixedScreen,
         messages,
         me,
         room,
         handleShareScreenStart,
         onPeerLeave,
      }}>
         {children}
      </Context.Provider>
   )
}

export default ContextProvider;
export { Context }
