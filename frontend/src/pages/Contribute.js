import React from 'react'
import styled from 'styled-components/macro'
import { COLORS } from '../GlobalStyles'
import background from '../assets/monstera-bg.jpg'
import { DropZone } from '../hooks/DropZone.js'

export const Contribute = () => {
  // TODO: reward users with badges for approved submissions?
  return (
    <Wrapper>
      <Banner />
      <Heading>contribute</Heading>
      <div className='content'>
        <p>
          Help us grow our database! Submit new houseplant information below so we can all take
          better care of our beloved plants.{' '}
          <em>*We review all submissions to ensure accuracy of information provided.</em>
        </p>
        <Form>
          <DropZone />
          {/* TODO: add form elements (make sure to keep human error to minimum) */}
          <p>plant name: </p>
          <p>plant needs: </p>
          <p>light: </p>
          <p>water: </p>
          <p>temperature: </p>
          <p>humidity: </p>
          <p>plant toxicity: </p>
          <p>source of info: </p>
        </Form>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  /* TODO: automatically get height of footer for calc */
  min-height: calc(100vh - 60px);
  .content {
    padding: 20px;
  }
`

const Banner = styled.div`
  background: url(${background}) center center / cover;
  height: 120px;
  width: 100%;
`

const Heading = styled.h1`
  background: ${COLORS.medium};
  color: #fff;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 3px solid ${COLORS.light};
`

const Form = styled.form``
