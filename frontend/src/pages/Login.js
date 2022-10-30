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

const LoginSchema = Yup.object().shape({
  email: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
})

export const Login = () => {
  useDocumentTitle('Log in | plantgeek')

  const { handleLogin, currentUser } = useContext(UserContext)
  const [loading, setLoading] = useState(false)

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
            <h1>welcome back!</h1>
            <img src={plantgeekLogo} alt='' />
          </div>
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={LoginSchema}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={handleSubmit}>
            {({ status, isSubmitting }) => (
              <Form>
                <FormItem name='email' label='Email'>
                  <Input name='email' type='text' autoFocus />
                </FormItem>
                <FormItem name='password' label='Password' sublabel=' - case sensitive'>
                  <Input.Password name='password' type='password' />
                </FormItem>
                <Button
                  htmlType='submit'
                  type='primary'
                  size='large'
                  disabled={loading || isSubmitting}
                  loading={loading || isSubmitting}>
                  LOG IN
                </Button>
                {status && <Alert type='error' message={status} showIcon />}
                <p className='subtext'>
                  Don't have an account yet? <Link to='/signup'>Sign up</Link>
                </p>
              </Form>
            )}
          </Formik>
        </Card>
      </FadeIn>
    </Wrapper>
  )
}
