import React, { useContext, useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useQueryClient } from 'react-query'
import { UserContext } from '../contexts/UserContext'
import { Wrapper, Card } from './SignUp'
import { FadeIn } from '../components/loaders/FadeIn.js'
import { Ellipsis } from '../components/loaders/Ellipsis'
import { Alert } from 'antd'

export const EmailVerification = () => {
  const { userId } = useParams()
  const history = useHistory()
  const queryClient = new useQueryClient()
  const { token, verifyEmail } = useContext(UserContext)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState(false)

  const handleVerify = async () => {
    if (userId) {
      const result = await verifyEmail(userId)
      if (result.error) {
        setError(true)
      } else {
        queryClient.invalidateQueries('current-user')
        setVerified(true)
      }
    }
  }

  handleVerify()

  useEffect(() => {
    if (verified && token) {
      setTimeout(() => {
        history.push('/profile')
      }, 3000)
    } else if (verified && !token) {
      setTimeout(() => {
        history.push('/login')
      }, 3000)
    }
  })

  return (
    <Wrapper>
      <FadeIn>
        <Card style={{ flexDirection: 'column' }}>
          <div className='header'>
            <h1>{verified ? 'Email verified!' : 'Verifying your email'}</h1>
          </div>
          <div className='body'>
            <p>
              {verified && token
                ? 'Redirecting to your profile...'
                : verified && !token
                ? 'Redirecting to login...'
                : 'Please wait...'}
            </p>
            <Ellipsis />
          </div>
          {error && <Alert type='error' message='Sorry, something went wrong.' showIcon />}
        </Card>
      </FadeIn>
    </Wrapper>
  )
}
