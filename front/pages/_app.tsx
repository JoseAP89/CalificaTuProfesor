import '../styles/globals.css'
import Layout from '../components/layout'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
      <ChakraProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
  )
}