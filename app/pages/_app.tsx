import React from 'react'
import { CacheProvider, EmotionCache } from '@emotion/react'
import { CssBaseline, StyledEngineProvider, Theme, ThemeProvider } from '@mui/material'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { SnackbarProvider } from 'notistack'

import { theme as customTheme } from '../assets/theme'
import createEmotionCache from '../utils/createEmotionCache'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, breackboint=device-breackboint"/>
      </Head>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={customTheme}>
          <SnackbarProvider maxSnack={3}>
            <CssBaseline/>
            <Component {...pageProps} />
          </SnackbarProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </CacheProvider>
  )
}

