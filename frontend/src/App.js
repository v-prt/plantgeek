import './App.less'
import React, { useContext } from 'react'
import { UserContext } from './contexts/UserContext'

import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import background from './assets/monstera1.jpg'
import { ScrollToTop } from './components/general/ScrollToTop'
import { Navbar } from './components/Navbar'
import { Homepage } from './pages/Homepage'
import { Browse } from './pages/Browse'
import { SignUp } from './pages/SignUp'
import { Login } from './pages/Login'
import { PasswordRecovery } from './pages/PasswordRecovery'
import { Welcome } from './pages/Welcome'
import { EmailVerification } from './pages/EmailVerification'
import { Guidelines } from './pages/Guidelines'
import { Terms } from './pages/Terms'
import { Privacy } from './pages/Privacy'
import { About } from './pages/About'
import { Settings } from './pages/Settings'
import { Contribute } from './pages/Contribute'
import { Admin } from './pages/Admin'
import { PlantProfile } from './pages/PlantProfile'
import { UserProfile } from './pages/UserProfile'
import { Footer } from './components/Footer'

import styled from 'styled-components/macro'
import GlobalStyles, { BREAKPOINTS } from './GlobalStyles'
import { Button } from 'antd'
import { BeatingHeart } from './components/loaders/BeatingHeart'
import placeholder from './assets/plant-placeholder.svg'

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
              <Route path='/signup'>
                <SignUp />
              </Route>
              <Route path='/login'>
                <Login />
              </Route>
              <Route path='/password-recovery'>
                <PasswordRecovery />
              </Route>
              <Route path='/welcome'>
                <Welcome />
              </Route>
              <Route path='/verify-email/:code'>
                <EmailVerification />
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
              <Route path='/admin'>
                <Admin />
              </Route>
              <Route path='/profile'>
                <UserProfile />
              </Route>
              <Route path='/plant/:slug'>
                <PlantProfile />
              </Route>
              <Route path='*'>
                <main className='not-found'>
                  <section className='inner'>
                    <img src={placeholder} alt='' />
                    <p>Oops, are you lost?</p>
                    <Link to='/'>
                      <Button type='primary'>GO HOME</Button>
                    </Link>
                  </section>
                </main>
              </Route>
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
  .not-found {
    section {
      background: #fff;
      max-width: 300px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      margin: auto;
      img {
        height: 100px;
        width: 100px;
      }
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
