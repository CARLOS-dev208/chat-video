import { useEffect } from 'react';
import { useMain } from '../../contexts';

export default function Index(){
   const {socket, isMobile} = useMain()

   useEffect(() => {
      console.log(socket, isMobile)
   }, []);

   return <h1>Helo!!!!</h1>
}
