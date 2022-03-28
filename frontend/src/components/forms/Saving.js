import React from 'react'
import styled from 'styled-components/macro'
import { COLORS } from '../../GlobalStyles'
import { LoadingOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

// simple indicator showing saving status for forms
// make sure to pass savingStatus (possible values: undefined, saving, saved, error) and you can use setTimeout (2 seconds) to make this only appear temporarily
export const Saving = ({ savingStatus }) => {
  return (
    <Wrapper className='saving'>
      <div className={`icon saving ${savingStatus === 'saving' && 'visible'}`}>
        <LoadingOutlined spin />
      </div>
      <div className={`icon saved ${savingStatus === 'saved' && 'visible'}`}>
        <CheckCircleOutlined />
      </div>
      <div className={`icon error ${savingStatus === 'error' && 'visible'}`}>
        <ExclamationCircleOutlined />
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: grid;
  place-content: center;
  position: relative;
  .icon {
    visibility: hidden;
    opacity: 0;
    color: #fff;
    font-size: 0.8rem;
    padding: 2px;
    display: grid;
    place-content: center;
    border-radius: 50%;
    transition: 0.2s ease-in-out;
    &.visible {
      visibility: visible;
      opacity: 1;
    }
  }
  .saving {
    background: #ccc;
  }
  .saved {
    background: ${COLORS.light};
    position: absolute;
  }
  .error {
    background: ${COLORS.danger};
    position: absolute;
  }
`
