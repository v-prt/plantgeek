import './App.less'
import React, { useEffect } from 'react'
import { usePlantsFetcher, useUsersFetcher } from './utilities/fetch'

import { BrowserRouter, Switch, Route } from 'react-router-dom'
import background from './assets/monstera1.jpg'
import { Navbar } from './components/Navbar'
import { Homepage } from './pages/Homepage'
import { Browse } from './pages/Browse'
import { Login } from './pages/Login'
import { SignUp } from './pages/SignUp'
import { Welcome } from './pages/Welcome'
import { Terms } from './pages/Terms'
import { Privacy } from './pages/Privacy'
import { Settings } from './pages/Settings'
import { Contribute } from './pages/Contribute'
import { PlantProfile } from './pages/PlantProfile'
import { UserProfile } from './pages/UserProfile'
import { Footer } from './components/Footer'

import styled from 'styled-components/macro'
import GlobalStyles, { BREAKPOINTS } from './GlobalStyles'

export const App = () => {
  // makes window scroll to top between renders
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  usePlantsFetcher()
  useUsersFetcher()

  // TODO: set app level loading state for checking if user logged in
  // TODO: restrict routes if user logged in/out
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Navbar />
      <Body>
        <Banner />
        <Switch>
          <Route exact path='/'>
            <Homepage />
          </Route>
          <Route exact path='/browse'>
            <Browse />
          </Route>
          <Route exact path='/login'>
            <Login />
          </Route>
          <Route exact path='/signup'>
            <SignUp />
          </Route>
          <Route exact path='/welcome'>
            <Welcome />
          </Route>
          <Route exact path='/terms'>
            <Terms />
          </Route>
          <Route exact path='/privacy'>
            <Privacy />
          </Route>
          <Route exact path='/settings'>
            <Settings />
          </Route>
          <Route exact path='/contribute'>
            <Contribute />
          </Route>
          <Route path='/user-profile/:username'>
            <UserProfile />
          </Route>
          <Route path='/plant-profile/:id'>
            <PlantProfile />
          </Route>
        </Switch>
        <Footer />
      </Body>
    </BrowserRouter>
  )
}

const Body = styled.div`
  min-height: 100vh;
  overscroll-behavior: none;
  display: flex;
  flex-direction: column;
  main {
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 50px auto 0 auto;
    padding: 10px 0;
    flex: 1;
    section {
      margin: 10px auto;
      padding: 20px;
      border-radius: 20px;
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    margin-right: 55px;
    main {
      padding: 20px 0;
      margin: auto;
      section {
        margin: 20px auto;
        padding: 30px;
      }
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.desktop}) {
    margin-right: 240px;
    main {
      max-width: 1200px;
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
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    display: block;
  }
`
