import React, { useState, useEffect, useCallback} from 'react';
import io from 'socket.io-client';

const ContextMain = React.createContext()
let socket;

function ProviderMain(props){
   const [isMobile, setIsMobile] = useState(false)

   const handleMobile = (size)=> setIsMobile(size <= 990 || false)

   const handleWidthResize = useCallback(event => {
      handleMobile(innerWidth)
      addEventListener('resize', ()=>{ handleMobile(innerWidth) })
   }, []);

   const socketInitializer = async () => {
      await fetch("/api/socket");
      socket = io();
   };

   useEffect(()=>{
      socketInitializer()
      handleWidthResize()
      return () => {removeEventListener('resize', ()=>{ handleMobile(innerWidth) })}
   },[handleWidthResize])

   return(
      <ContextMain.Provider value={{
         socket: io(),
         isMobile,
      }}>
         {props.children}
      </ContextMain.Provider>
   )
}
export default ProviderMain
export { ContextMain }
