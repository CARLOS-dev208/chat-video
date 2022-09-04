import '../styles/globals.css'
import type { AppProps } from 'next/app'
import ProviderGlobal from '../contexts';

function MyApp({ Component, pageProps }: AppProps) {
  return (
     <ProviderGlobal>
      <Component {...pageProps} />
     </ProviderGlobal>
  )
}

export default MyApp
