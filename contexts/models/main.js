import React, {useEffect} from 'react';
import io from 'socket.io-client';

const ContextMain = React.createContext()
let socket;

function ProviderMain(props){
   const socketInitializer = async () => {
      await fetch("/api/socket");
      socket = io();
   };

   useEffect(()=>{
      socketInitializer()
   },[])

   return(
      <ContextMain.Provider value={{
         socket: io(),
      }}>
         {props.children}
      </ContextMain.Provider>
   )
}
export default ProviderMain
export { ContextMain }
