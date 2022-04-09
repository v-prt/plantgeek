import React, { useContext, useEffect } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'
import { Wrapper, Card } from './SignUp'
import { FadeIn } from '../components/loaders/FadeIn.js'
import { Ellipsis } from '../components/loaders/Ellipsis'

export const Welcome = () => {
  const history = useHistory()
  const { token, currentUser } = useContext(UserContext)

  useEffect(() => {
    if (currentUser) {
      setTimeout(() => {
        history.push(`/user-profile/${currentUser._id}`)
      }, 3000)
    }
  })

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
            <Ellipsis color='#222' />
          </div>
        </Card>
      </FadeIn>
    </Wrapper>
  )
}
