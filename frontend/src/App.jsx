import './App.less'
import React, { useContext } from 'react'
import { UserContext } from './contexts/UserContext'

import { BrowserRouter, Route, Link, Routes } from 'react-router-dom'
import { ScrollToTop } from './components/general/ScrollToTop'
import { Navbar } from './components/Navbar'
import { Homepage } from './pages/Homepage'
import { Browse } from './pages/Browse'
import { SignUp } from './pages/SignUp'
import { Login } from './pages/Login'
import { PasswordRecovery } from './pages/PasswordRecovery'
import { Welcome } from './pages/Welcome'
import { EmailVerification } from './pages/EmailVerification'
import { CareTips } from './pages/CareTips'
import { Terms } from './pages/Terms'
import { Privacy } from './pages/Privacy'
import { About } from './pages/About'
import { Settings } from './pages/Settings'
import { Contribute } from './pages/Contribute'
import { Admin } from './pages/Admin'
import { PlantProfile } from './pages/PlantProfile'
import { UserProfile } from './pages/UserProfile'
import { Footer } from './components/Footer'

import styled from 'styled-components'
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
            {/* <Banner /> */}
            <Routes>
              <Route path='/' element={<Homepage />} />
              <Route path='/browse' element={<Browse />} />
              <Route path='/signup' element={<SignUp />} />
              <Route path='/login' element={<Login />} />
              <Route path='/password-recovery' element={<PasswordRecovery />} />
              <Route path='/welcome' element={<Welcome />} />
              <Route path='/verify-email/:code' element={<EmailVerification />} />
              <Route path='/care' element={<CareTips />} />
              <Route path='/terms' element={<Terms />} />
              <Route path='/privacy' element={<Privacy />} />
              <Route path='/About' element={<About />} />
              <Route path='/settings' element={<Settings />} />
              <Route path='/contribute' element={<Contribute />} />
              <Route path='/admin' element={<Admin />} />
              <Route path='/profile' element={<UserProfile />} />
              <Route path='/plant/:slug' element={<PlantProfile />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
            <Footer />
          </Body>
        </>
      ) : (
        <Fallback />
      )}
    </BrowserRouter>
  )
}

const NotFound = () => {
  return (
    <main className='not-found'>
      <section className='inner'>
        <img src={placeholder} alt='' />
        <p>Oops, are you lost?</p>
        <Link to='/'>
          <Button type='primary'>GO HOME</Button>
        </Link>
      </section>
    </main>
  )
}

const Fallback = () => {
  return (
    <div className='loading' style={{ height: '100%', display: 'grid' }}>
      <BeatingHeart />
    </div>
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
      padding: 40px 20px;
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
        padding: 60px 30px;
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
        padding: 60px 40px;
      }
    }
  }
`
