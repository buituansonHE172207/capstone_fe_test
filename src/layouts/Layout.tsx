import React from 'react'
import logoUrl from '#assets/img/logo.svg'
import { PageContextProvider } from '#src/hooks/usePageContext.js'
import { Link } from '#components/common/Link.js'
import type { PageContext } from 'vike/types'
import '../assets/css/index.css'
import '../assets/css/Layout/Layout.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { HydrationBoundary } from '@tanstack/react-query'
import RQProvider from '#utils/providers/RQProvider.js'


function Layout({
  children,
  pageContext,
}: {
  children: React.ReactNode
  pageContext: PageContext
}) {
  const { dehydratedState } = pageContext
  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <RQProvider>
          <HydrationBoundary state={dehydratedState}>
            <ToastContainer position='top-right' hideProgressBar theme='colored' />
            <Frame>
              <Sidebar>
                <Logo />
                <Link href='/'>Welcome</Link>
                <Link href='/about'>About</Link>
                <Link href='/star-wars'>Data Fetching</Link>
                <Link href='/login'>Login</Link>
                <Link href='/test'>Test</Link>
                <Link href='/posts'>Posts</Link>
              </Sidebar>
              <Content>{children}</Content>
            </Frame>
          </HydrationBoundary>

        </RQProvider>
      </PageContextProvider>
    </React.StrictMode>
  )
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        maxWidth: 900,
        margin: 'auto',
      }}
    >
      {children}
    </div>
  )
}

function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div
      id='sidebar'
      style={{
        padding: 20,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        lineHeight: '1.8em',
        borderRight: '2px solid #eee',
      }}
    >
      {children}
    </div>
  )
}

function Content({ children }: { children: React.ReactNode }) {
  return (
    <div id='page-container'>
      <div
        id='page-content'
        style={{
          padding: 20,
          paddingBottom: 50,
          minHeight: '100vh',
        }}
      >
        {children}
      </div>
    </div>
  )
}

function Logo() {
  return (
    <div
      style={{
        marginTop: 20,
        marginBottom: 10,
      }}
    >
      <a href='/'>
        <img src={logoUrl} height={64} width={64} alt='logo' />
      </a>
    </div>
  )
}

export { Layout }