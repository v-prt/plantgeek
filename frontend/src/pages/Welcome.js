import React, { useContext, useEffect } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'
import { COLORS } from '../GlobalStyles'
import { Wrapper, Card } from './SignUp'
import { FadeIn } from '../components/loaders/FadeIn.js'
import { Ellipsis } from '../components/loaders/Ellipsis'

export const Welcome = () => {
  const history = useHistory()
  const { token, currentUser } = useContext(UserContext)

  useEffect(() => {
    if (currentUser) {
      setTimeout(() => {
        history.push('/profile')
      }, 3000)
    }
  })

  return !token ? (
    <Redirect to='/' />
  ) : (
    <Wrapper>
      <FadeIn>
        <Card>
          <div className='header'>
            <h1>Congratulations!</h1>
          </div>
          <div className='body'>
            <p>You're all signed up. You'll be redirected to your profile soon.</p>
            <Ellipsis color={COLORS.light} />
          </div>
        </Card>
      </FadeIn>
    </Wrapper>
  )
}
