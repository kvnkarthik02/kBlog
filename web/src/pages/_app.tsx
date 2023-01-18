import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/core'
import {createClient, dedupExchange, fetchExchange, Provider } from 'urql'
import { cacheExchange } from '@urql/exchange-graphcache';
import theme from '../theme'

const client = createClient(
  {
    url: "http://localhost:5000/graphql",
    fetchOptions: {
      credentials:"include",
    },
    exchanges: [dedupExchange, cacheExchange({}), fetchExchange]
    
});

function MyApp({ Component, pageProps }) {
  return (

    <Provider value={client}>
      <ThemeProvider theme={theme}>
        <ColorModeProvider>
          <CSSReset />
          <Component {...pageProps} />
        </ColorModeProvider>
      </ThemeProvider>      
    </Provider>

  )
}

export default MyApp