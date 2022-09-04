import { useContext } from 'react';
import ProviderMain, { ContextMain } from './models/main';

export function useMain(){
   return useContext(ContextMain)
}

export default function ProviderGlobal(props){
   return (<ProviderMain>
      {props.children}
   </ProviderMain>)
}
