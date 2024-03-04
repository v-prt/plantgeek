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

export const Login = () => {
  useDocumentTitle('Log in • plantgeek')

  const { handleLogin, currentUser } = useContext(UserContext)
  const [loading, setLoading] = useState(false)

  const schema = Yup.object().shape({
    username: Yup.string().required('Required'),
    password: Yup.string().required('Required'),
  })

  const handleSubmit = async (values, { setStatus }) => {
    setLoading(true)
    setStatus(undefined)
    const result = await handleLogin(values)
    if (result.error) {
      setStatus(result.error.message)
      setLoading(false)
    } else {
      localStorage.setItem('plantgeekToken', result.token)
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
            <h1>welcome back!</h1>
          </div>
          <Formik
            initialValues={{
              username: '',
              password: '',
            }}
            validationSchema={schema}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={handleSubmit}>
            {({ status, isSubmitting }) => (
              <Form>
                <FormItem name='username' label='Email or username'>
                  <Input name='username' type='text' autoFocus />
                </FormItem>
                <FormItem name='password' label='Password'>
                  <Input.Password name='password' type='password' />
                </FormItem>
                <Link to='/password-recovery'>Forgot password?</Link>
                <Button
                  htmlType='submit'
                  type='primary'
                  size='large'
                  disabled={loading || isSubmitting}
                  loading={loading || isSubmitting}>
                  LOG IN
                </Button>
                {status && <Alert type='error' message={status} showIcon />}
              </Form>
            )}
          </Formik>
          <p className='subtext'>
            New to plantgeek? <Link to='/signup'>Sign up</Link>
          </p>
        </Card>
      </FadeIn>
    </Wrapper>
  )
}
