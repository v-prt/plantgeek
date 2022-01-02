import React, { useEffect } from 'react'
import { usePlantsFetcher, useUsersFetcher } from './utilities/fetch'

import { BrowserRouter, Switch, Route } from 'react-router-dom'
import background from './assets/monstera-banner.webp'
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
import { DetailedPlantList } from './components/lists/DetailedPlantList'
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
      <Main>
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
          <Route path='/user-collection/:username'>
            <DetailedPlantList title='collection' />
          </Route>
          <Route path='/user-favorites/:username'>
            <DetailedPlantList title='favorites' />
          </Route>
          <Route path='/user-wishlist/:username'>
            <DetailedPlantList title='wishlist' />
          </Route>
          <Route path='/plant-profile/:id'>
            <PlantProfile />
          </Route>
        </Switch>
        <Footer />
      </Main>
    </BrowserRouter>
  )
}

const Main = styled.div`
  overscroll-behavior: none;
  min-height: 100vh;
  width: calc(100vw - 240px);
  display: flex;
  flex-direction: column;
  @media (max-width: 999px) {
    width: calc(100vw - 92px);
  }
`

const Banner = styled.div`
  background: url(${background}) center center / cover;
  height: 120px;
  width: 100%;
`
