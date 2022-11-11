import React, { useContext, useEffect, useState } from 'react'
import { Redirect, useParams, useHistory } from 'react-router-dom'
import { useQueryClient } from 'react-query'
import { UserContext } from '../contexts/UserContext'
import { Wrapper, Card } from './SignUp'
import { FadeIn } from '../components/loaders/FadeIn.js'
import { Ellipsis } from '../components/loaders/Ellipsis'
import { Button, Alert, message } from 'antd'
import { RedoOutlined } from '@ant-design/icons'

export const EmailVerification = () => {
  const { hashedId } = useParams()
  const history = useHistory()
  const queryClient = new useQueryClient()
  const { token, verifyEmail, resendVerificationEmail } = useContext(UserContext)
  const [verified, setVerified] = useState(false)
  const [status, setStatus] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleVerify = async () => {
    if (hashedId) {
      const result = await verifyEmail(hashedId)
      if (result.error) {
        setStatus(result.error)
      } else {
        queryClient.invalidateQueries('current-user')
        setVerified(true)
      }
    }
  }

  useEffect(() => {
    if (token && hashedId) {
      handleVerify()
    }
  })

  useEffect(() => {
    if (verified) {
      setTimeout(() => {
        history.push('/profile')
      }, 3000)
    }
  })

  const handleVerificationEmail = async () => {
    setLoading(true)
    const result = await resendVerificationEmail()
    if (result.error) {
      message.error(result.error)
    } else {
      message.success('Verification email sent')
    }
    setLoading(false)
  }

  return !token ? (
    <Redirect to='/login' />
  ) : (
    <Wrapper>
      <FadeIn>
        <Card>
          <div className='header'>
            <h1>email verification</h1>
          </div>
          {status ? (
            <div className='body'>
              <Alert type='error' message={status} showIcon />
              <Button
                type='link'
                icon={<RedoOutlined />}
                onClick={handleVerificationEmail}
                loading={loading}>
                Resend email
              </Button>
            </div>
          ) : (
            <>
              <div className='body'>
                <p>
                  {verified
                    ? `Verified! You'll be redirected to your profile soon.`
                    : 'Verifying, please wait.'}
                </p>
                <Ellipsis />
              </div>
            </>
          )}
        </Card>
      </FadeIn>
    </Wrapper>
  )
}
