import React, { useContext, useState } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'
import { Formik, Form } from 'formik'
import { Input } from 'formik-antd'
import { Button, Alert } from 'antd'
import * as Yup from 'yup'
import { FormItem } from '../components/forms/FormItem'
import { Wrapper, Card } from './SignUp'
import { FadeIn } from '../components/loaders/FadeIn'
import plantgeekLogo from '../assets/logo.webp'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export const PasswordRecovery = () => {
  useDocumentTitle('Password recovery • plantgeek')

  const { sendPasswordResetCode, resetPassword, currentUser } = useContext(UserContext)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(undefined)
  const [codeSent, setCodeSent] = useState(false)
  const [passwordChanged, setPasswordChanged] = useState(false)

  const handleResetCode = async () => {
    setStatus(undefined)
    const result = await sendPasswordResetCode(email)
    if (result.error) {
      setStatus(result.error)
    } else {
      setCodeSent(true)
    }
  }

  const handlePasswordReset = async values => {
    const data = {
      email,
      code: values.code,
      newPassword: values.newPassword,
    }
    setStatus(undefined)
    const result = await resetPassword(data)
    if (result.error) {
      setStatus(result.error)
    } else {
      setPasswordChanged(true)
    }
  }

  return currentUser ? (
    <Redirect to='/' />
  ) : (
    <Wrapper>
      <FadeIn>
        <Card>
          <div className='header'>
            <img src={plantgeekLogo} alt='' />
            <h1>reset password</h1>
          </div>
          {!passwordChanged ? (
            <>
              <Formik
                initialValues={{
                  email: '',
                }}
                validationSchema={Yup.object().shape({
                  email: Yup.string().required('Required'),
                })}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={handleResetCode}>
                {({ isSubmitting }) => (
                  <Form>
                    <FormItem name='email' label='Email'>
                      <Input name='email' autoFocus onChange={e => setEmail(e.target.value)} />
                    </FormItem>
                    <Button
                      htmlType='submit'
                      type={codeSent ? 'secondary' : 'primary'}
                      size='large'
                      loading={isSubmitting}>
                      {codeSent ? 'RESEND CODE' : 'SEND RESET CODE'}
                    </Button>
                  </Form>
                )}
              </Formik>
              {codeSent && (
                <Formik
                  initialValues={{
                    code: '',
                    newPassword: '',
                    confirmPassword: '',
                  }}
                  validationSchema={Yup.object().shape({
                    code: Yup.string().required('Required'),
                    newPassword: Yup.string().min(6, `That's too short`).required('Required'),
                    confirmPassword: Yup.string()
                      .required('You must confirm your new password')
                      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
                  })}
                  validateOnChange={false}
                  validateOnBlur={false}
                  onSubmit={handlePasswordReset}>
                  {({ isSubmitting }) => (
                    <Form>
                      <p className='info-text'>
                        A code has been sent to your email. Please enter it below to reset your
                        password.
                      </p>
                      <FormItem name='code' label='Password reset code'>
                        <Input name='code' />
                      </FormItem>
                      <FormItem name='newPassword' label='New password'>
                        <Input.Password name='newPassword' type='password' />
                      </FormItem>
                      <FormItem name='confirmPassword' label='Confirm new password'>
                        <Input.Password name='confirmPassword' type='password' />
                      </FormItem>
                      <Button htmlType='submit' type='primary' size='large' loading={isSubmitting}>
                        CHANGE PASSWORD
                      </Button>
                    </Form>
                  )}
                </Formik>
              )}
              {status && <Alert type='error' message={status} showIcon />}
              <p className='subtext'>
                Here by mistake? <Link to='/login'>Log in</Link> or{' '}
                <Link to='/signup'>Sign up</Link>
              </p>
            </>
          ) : (
            <div className='password-changed'>
              <Alert type='success' message='Password changed successfully' showIcon />
              <p className='subtext'>
                <Link to='/login'>Log in</Link> with your new password
              </p>
            </div>
          )}
        </Card>
      </FadeIn>
    </Wrapper>
  )
}
