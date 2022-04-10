import { useState } from 'react'
import styled from 'styled-components/macro'
import { COLORS } from '../../GlobalStyles'
import { UpCircleOutlined } from '@ant-design/icons'

export const ScrollButton = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  window.onscroll = () => {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
      setIsScrolled(true)
    } else setIsScrolled(false)
  }

  const scrollToTop = () => {
    document.body.scrollTop = 0 // For Safari
    document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
    // scroll-behavior: smooth;
  }

  return (
    <Wrapper
      id='scrollBtn'
      type='secondary'
      className='scroll-btn'
      onClick={scrollToTop}
      visible={isScrolled}>
      <UpCircleOutlined />
    </Wrapper>
  )
}

const Wrapper = styled.button`
  background: rgba(255, 255, 255, 0.7);
  color: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  height: 30px;
  width: 30px;
  display: ${props => (props.visible ? 'grid' : 'none')};
  place-content: center;
  border: 0;
  margin: 0;
  padding: 0;
  font-size: 1.2rem;
  transition: 0.1s ease-in-out;
  z-index: 10;
  .anticon {
    display: grid;
  }
  &:hover,
  &:focus {
    color: ${COLORS.accent};
  }
`
