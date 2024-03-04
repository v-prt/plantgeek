import { Link } from 'react-router-dom'
import { useQueryClient } from 'react-query'
import { API_URL } from '../constants'
import { Formik, Form } from 'formik'
import { Input } from 'formik-antd'
import { FormItem } from './forms/FormItem'
import * as Yup from 'yup'
import axios from 'axios'
import { message, Alert, Button } from 'antd'
import styled from 'styled-components'
import { BiLogInCircle } from 'react-icons/bi'

export const SubmitReport = ({ currentUser, plantId, setReportModalOpen }) => {
  const queryClient = useQueryClient()
  const initialValues = {
    message: '',
    sourceUrl: '',
  }

  const schema = Yup.object({
    message: Yup.string().required('Required'),
    sourceUrl: Yup.string().url('Invalid URL'),
  })

  const handleSubmit = async values => {
    if (currentUser.emailVerified) {
      try {
        await axios.post(`${API_URL}/reports/${plantId}`, {
          userId: currentUser._id,
          plantId,
          message: values.message,
          sourceUrl: values.sourceUrl,
        })
        message.success('Report submitted')
        queryClient.invalidateQueries('plant-reports')
        setReportModalOpen(false)
      } catch (err) {
        console.log(err)
        message.error('Oops, something went wrong')
      }
    }
  }

  return (
    <Wrapper>
      {currentUser ? (
        <Formik initialValues={initialValues} validationSchema={schema} onSubmit={handleSubmit}>
          {({ isSubmitting, submitForm }) => (
            <Form>
              <h3>Report plant</h3>
              <div className='instructions'>
                <p>
                  Please note any incorrect information on this plant and include your suggested
                  change. If possible, provide a link to your source to help us validate your
                  information.
                </p>
                <p>
                  We also welcome suggestions for additional information to add to this plant's
                  page. Thank you for your contribution!
                </p>
              </div>

              <FormItem name='message'>
                <Input.TextArea
                  name='message'
                  placeholder={`What's wrong with this plant?`}
                  rows={4}
                  style={{ resize: 'none' }}
                />
              </FormItem>
              <FormItem name='sourceUrl'>
                <Input name='sourceUrl' placeholder='Source URL' />
              </FormItem>
              {!currentUser.emailVerified && (
                <Alert
                  type='warning'
                  message='Please verify your email address to report plants.'
                  showIcon
                />
              )}
              <Button
                type='primary'
                disabled={isSubmitting || !currentUser.emailVerified}
                loading={isSubmitting}
                onClick={submitForm}
              >
                SUBMIT
              </Button>
            </Form>
          )}
        </Formik>
      ) : (
        // TODO: add redirect to return user here after they log in
        <div className='login'>
          <p>Please log in to report plants.</p>
          <Link to='/login'>
            <Button type='primary'>
              <BiLogInCircle /> LOG IN
            </Button>
          </Link>
        </div>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  padding: 20px 0;
  h3 {
    margin-bottom: 20px;
  }
  .instructions {
    p {
      margin-bottom: 20px;
    }
  }
  .info-text {
    font-size: 0.8rem;
    margin-bottom: 5px;
    opacity: 0.7;
  }
  button {
    margin: 20px auto 0 auto;
  }
  .login {
    text-align: center;
    button {
      display: flex;
      gap: 8px;
    }
  }
`
