import React, { useContext } from 'react'
import { Redirect } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'
import { Wrapper, Card } from './SignUp'
import { FadeIn } from '../components/loaders/FadeIn.js'

export const Welcome = () => {
  const { token } = useContext(UserContext)

  // console.log(currentUser)

  //   TODO: add setTimeout to redirect user to their profile after ~3sec. need react-query for userData
  return !token ? (
    <Redirect to='/' />
  ) : (
    <Wrapper>
      <FadeIn duration={700} delay={150}>
        <Card>
          <div className='header'>
            <h1>Congratulations!</h1>
          </div>
          <div className='body'>
            <p>You're all signed up. You'll be redirected to your profile soon.</p>
          </div>
        </Card>
      </FadeIn>
    </Wrapper>
  )
}
