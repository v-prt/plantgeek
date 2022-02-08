import React, { useEffect } from 'react'
import { usePlantsFetcher, useUsersFetcher } from './utilities/fetch'

import { BrowserRouter, Switch, Route } from 'react-router-dom'
import background from './assets/banner1.jpg'
import { Navbar } from './components/Navbar'
import { Homepage } from './pages/Homepage'
import { Browse } from './pages/Browse'
import { Login } from './pages/Login'
import { SignUp } from './pages/SignUp'
import { Terms } from './pages/Terms'
import { Privacy } from './pages/Privacy'
import { Settings } from './pages/Settings'
import { Contribute } from './pages/Contribute'
import { PlantProfile } from './pages/PlantProfile'
import { UserProfile } from './pages/UserProfile'
import { Footer } from './components/Footer'

import styled from 'styled-components/macro'
import GlobalStyles from './GlobalStyles'

export const App = () => {
  // makes window scroll to top between renders
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  usePlantsFetcher()
  useUsersFetcher()

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
  overscroll-behavior: none;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  /* margin-right: 45px; */
  main {
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    padding: 20px 0;
    section {
      margin: 10px 0;
      padding: 20px;
      border-radius: 20px;
    }
  }
  @media only screen and (min-width: 500px) {
    margin-right: 55px;
    main {
      width: 80%;
      section {
        margin: 20px 0;
        padding: 30px;
      }
    }
  }
  @media only screen and (min-width: 1000px) {
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
`
