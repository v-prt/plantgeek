import './App.less'
import React, { useContext } from 'react'
import { UserContext } from './contexts/UserContext'

import { BrowserRouter, Switch, Route } from 'react-router-dom'
import background from './assets/monstera1.jpg'
import { ScrollToTop } from './components/general/ScrollToTop'
import { Navbar } from './components/Navbar'
import { Homepage } from './pages/Homepage'
import { Browse } from './pages/Browse'
import { Login } from './pages/Login'
import { SignUp } from './pages/SignUp'
import { Welcome } from './pages/Welcome'
import { Guidelines } from './pages/Guidelines'
import { Terms } from './pages/Terms'
import { Privacy } from './pages/Privacy'
import { About } from './pages/About'
import { Settings } from './pages/Settings'
import { Contribute } from './pages/Contribute'
import { Review } from './pages/Review'
import { PlantProfile } from './pages/PlantProfile'
import { UserProfile } from './pages/UserProfile'
import { Footer } from './components/Footer'

import styled from 'styled-components/macro'
import GlobalStyles, { BREAKPOINTS } from './GlobalStyles'
import { BeatingHeart } from './components/loaders/BeatingHeart'

export const App = () => {
  const { checkedToken, userStatus } = useContext(UserContext)

  return (
    <BrowserRouter>
      <GlobalStyles />
      <ScrollToTop />
      {checkedToken && userStatus === 'success' ? (
        <>
          <Navbar />
          <Body>
            <Banner />
            <Switch>
              <Route exact path='/'>
                <Homepage />
              </Route>
              <Route path='/browse'>
                <Browse />
              </Route>
              <Route path='/login'>
                <Login />
              </Route>
              <Route path='/signup'>
                <SignUp />
              </Route>
              <Route path='/welcome'>
                <Welcome />
              </Route>
              <Route path='/guidelines'>
                <Guidelines />
              </Route>
              <Route path='/terms'>
                <Terms />
              </Route>
              <Route path='/privacy'>
                <Privacy />
              </Route>
              <Route path='/About'>
                <About />
              </Route>
              <Route path='/settings'>
                <Settings />
              </Route>
              <Route path='/contribute'>
                <Contribute />
              </Route>
              <Route path='/review'>
                <Review />
              </Route>
              <Route path='/profile'>
                <UserProfile />
              </Route>
              <Route path='/plant/:slug'>
                <PlantProfile />
              </Route>
              {/* TODO: catchall for non-existing routes (generic "not found" or redirect to homepage) */}
            </Switch>
            <Footer />
          </Body>
        </>
      ) : (
        <div className='loading' style={{ height: '100%', display: 'grid' }}>
          <BeatingHeart />
        </div>
      )}
    </BrowserRouter>
  )
}

const Body = styled.div`
  min-height: 100vh;
  overscroll-behavior: none;
  display: flex;
  flex-direction: column;
  main {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin: 53px auto 0 auto;
    padding: 10px;
    flex: 1;
    section {
      width: 100%;
      padding: 20px;
      border-radius: 20px;
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    main {
      gap: 20px;
      padding: 20px;
      section {
        padding: 30px;
      }
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.desktop}) {
    margin-left: 241px;
    main {
      max-width: 1200px;
      gap: 30px;
      margin: 0 auto;
      padding: 30px;
      section {
        padding: 40px;
      }
    }
  }
`

const Banner = styled.div`
  background: url(${background}) center center / cover;
  height: 110px;
  width: 100%;
  display: none;
  @media only screen and (min-width: ${BREAKPOINTS.desktop}) {
    display: block;
  }
`
