import styled from 'styled-components/macro'

export const Ellipsis = () => {
  return (
    <Wrapper>
      <div className='ellipsis'>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  margin: auto;
  line-height: 1;
  .ellipsis {
    margin: auto;
    position: relative;
    width: 40px;
    height: 30px;
  }
  .ellipsis div {
    background: #222;
    position: absolute;
    top: 10px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }
  .ellipsis div:nth-child(1) {
    left: 4px;
    animation: ellipsis1 0.6s infinite;
  }
  .ellipsis div:nth-child(2) {
    left: 4px;
    animation: ellipsis2 0.6s infinite;
  }
  .ellipsis div:nth-child(3) {
    left: 16px;
    animation: ellipsis2 0.6s infinite;
  }
  .ellipsis div:nth-child(4) {
    left: 28px;
    animation: ellipsis3 0.6s infinite;
  }
  @keyframes ellipsis1 {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
  @keyframes ellipsis3 {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }
  @keyframes ellipsis2 {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(12px, 0);
    }
  }
`
