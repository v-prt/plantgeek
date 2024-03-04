import React, { useContext, useEffect } from 'react'
import { Redirect, useNavigate } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext.jsx'
import { Wrapper, Card } from './SignUp.jsx'
import { FadeIn } from '../components/loaders/FadeIn.jsx'
import { Ellipsis } from '../components/loaders/Ellipsis.jsx'
import success from '../assets/success.svg'

export const Welcome = () => {
  const navigate = useNavigate()
  const { token, currentUser } = useContext(UserContext)

  useEffect(() => {
    if (currentUser) {
      setTimeout(() => {
        navigate('/profile')
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
            <h1>Welcome!</h1>
          </div>
          <div className='body welcome'>
            <img className='success' src={success} alt='' />
            <p>You're all signed up. You'll be redirected to your profile soon.</p>
            <Ellipsis />
          </div>
        </Card>
      </FadeIn>
    </Wrapper>
  )
}
