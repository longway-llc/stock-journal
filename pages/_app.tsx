import {AppProps} from 'next/app'
import {CssBaseline, makeStyles, ThemeProvider} from '@material-ui/core'
import {theme} from '../assets/theme'
import React from 'react'
import Head from 'next/head'


import {SnackbarProvider} from 'notistack'


const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(8)
    }
  }
}))

function MyApp({Component, pageProps}: AppProps) {

  //hydrate styles: official example https://github.com/mui-org/material-ui/blob/master/examples/nextjs
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
      <>
        <Head>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, breackboint=device-breackboint"/>
        </Head>
        <ThemeProvider theme={theme}>
              <SnackbarProvider maxSnack={3} classes={{root: useStyles().root}}>
                <CssBaseline/>
                <Component {...pageProps} />
                <style global jsx>{`
                                body {
                                    letter-spacing: 0.015em;
                                    min-height: 100vh;
                                }
                            
                                #__next{
                                    min-height: inherit;
                                    display: flex;
                                    flex-direction: column;
                                }
                                a, a:hover {
                                    text-decoration: none;
                                }
                            `}</style>
              </SnackbarProvider>
        </ThemeProvider>
      </>
  )
}

export default MyApp

