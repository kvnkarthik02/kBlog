import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/core'
import {createClient, dedupExchange, fetchExchange, Provider, Query } from 'urql'
import { cacheExchange, Cache, QueryInput } from '@urql/exchange-graphcache';
import theme from '../theme'
import { LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation } from '../gql/graphql';

function betterUpdateQuery<Result, Query>(
    cache: Cache, 
    qi: QueryInput,
    result: any, 
    fn: (r: Result, q: Query) => Query
  ){
    return cache.updateQuery(qi, (data)=> fn(result, data as any) as any);
} 

const client = createClient(
  {
    url: "http://localhost:5000/graphql",
    fetchOptions: {
      credentials: "include",
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        updates: {
          Mutation: {

            logout:(_result, args, cache, info)=> {               //reset the cache as soon as we logout instead of simply reloading the window
              betterUpdateQuery<LogoutMutation, MeQuery>(  
                cache, 
                {query: MeDocument},
                _result,
                ()=> ({me: null})
              );
            },

            login: (_result, args, cache, info) => {                  // update cache data everytime the login mutation is used.
              betterUpdateQuery<LoginMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.login.errors) {
                    return query;
                  } else {
                    return {
                      me: result.login.user,
                    };
                  }
                }
              );
            },
            register: (_result, args, cache, info) => {               // update cache data everytime the register mutation is used.
              betterUpdateQuery<RegisterMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.register.errors) {
                    return query;
                  } else {
                    return {
                      me: result.register.user,
                    };
                  }
                }
              );
            },
          },
        },
      }),
      fetchExchange,
    ],
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