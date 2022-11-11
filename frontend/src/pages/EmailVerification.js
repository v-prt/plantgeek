import React, { useContext, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQueryClient } from 'react-query'
import { UserContext } from '../contexts/UserContext'
import { Wrapper, Card } from './SignUp'
import { FadeIn } from '../components/loaders/FadeIn.js'
import { Ellipsis } from '../components/loaders/Ellipsis'
import { Button, Alert, message } from 'antd'
import { RedoOutlined } from '@ant-design/icons'
import success from '../assets/success.svg'

export const EmailVerification = () => {
  const { code } = useParams()
  const queryClient = new useQueryClient()
  const { token, currentUser, verifyEmail, resendVerificationEmail, handleLogout } =
    useContext(UserContext)
  const [checked, setChecked] = useState(false)
  const [status, setStatus] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleVerify = async () => {
    setStatus(false)
    const result = await verifyEmail(code)
    if (result.error) {
      setStatus(result.error)
    } else {
      queryClient.invalidateQueries('current-user')
    }
    setChecked(true)
  }

  useEffect(() => {
    if (!currentUser?.emailVerified && token && code && !checked) {
      handleVerify()
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

  return (
    <Wrapper>
      <FadeIn>
        <Card>
          <div className='header'>
            <h1>email verification</h1>
          </div>
          <div className='body email-verification'>
            {token ? (
              status ? (
                <>
                  <Alert type='error' message={status} showIcon />
                  <p>
                    We couldn't verify <b>{currentUser.email}</b> with the given link.
                  </p>
                  <div className='buttons'>
                    <Button
                      type='primary'
                      icon={<RedoOutlined />}
                      onClick={handleVerificationEmail}
                      loading={loading}>
                      RESEND EMAIL
                    </Button>
                    <Button type='secondary' onClick={handleLogout}>
                      LOG OUT
                    </Button>
                  </div>
                </>
              ) : currentUser.emailVerified ? (
                <>
                  <img className='success' src={success} alt='' />
                  <p>Thanks! Your email has been verified.</p>
                  <Link to='/'>
                    <Button type='primary'>GO HOME</Button>
                  </Link>
                </>
              ) : (
                <>
                  <div className='loading'>
                    <Ellipsis />
                  </div>
                  <p>Verifying, please wait.</p>
                </>
              )
            ) : (
              <>
                <Alert type='warning' message='You must log in to verify your email.' showIcon />
                <Link to='/login'>
                  <Button type='primary'>LOG IN</Button>
                </Link>
              </>
            )}
          </div>
        </Card>
      </FadeIn>
    </Wrapper>
  )
}
