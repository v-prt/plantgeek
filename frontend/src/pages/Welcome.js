import React, { useContext, useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { requestUsers, receiveUsers } from '../actions.js'
import { UserContext } from '../contexts/UserContext'
import { Wrapper, Card } from './SignUp'
import { FadeIn } from '../components/loaders/FadeIn.js'

export const Welcome = () => {
  const dispatch = useDispatch()
  const { currentUser } = useContext(UserContext)

  useEffect(() => {
    dispatch(requestUsers())
    axios
      .get('/users')
      .then(res => dispatch(receiveUsers(res.data.data)))
      .catch(err => console.log(err))
  })

  console.log(currentUser)

  //   TODO: add setTimeout to redirect user to their profile after ~3sec. need react-query for userData
  return (
    <Wrapper>
      <FadeIn duration={700} delay={150}>
        <Card>
          <div className='header'>
            <h1>Congratulations!</h1>
          </div>
          <div className='body'>
            <p>You're all signed up. You'll be redirected to your profile soon.</p>
          </div>
        </Card>
      </FadeIn>
    </Wrapper>
  )
}
