import '../styles/globals.css'
import type { AppProps } from 'next/app';
import { ContextProvider } from '../context/Context';

export default function MyApp({ Component, pageProps }: AppProps) {
  return( 
    <ContextProvider>
      <Component {...pageProps} />
    </ContextProvider>
  )
}

