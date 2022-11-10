import styled from 'styled-components/macro'

export const GhostPlantCard = () => {
  return (
    <Wrapper>
      <div className='thumbnail loading-gradient' />
      <div className='name loading-gradient' />
      <div className='needs'>
        <div className='row loading-gradient' />
        <div className='row loading-gradient' />
        <div className='row loading-gradient' />
        <div className='row loading-gradient' />
      </div>
      <div className='actions'>
        <div className='icon loading-gradient' />
        <div className='group'>
          <div className='icon loading-gradient' />
          <div className='icon loading-gradient' />
        </div>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 10px;
  width: 100%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  div {
    border-radius: 10px;
  }
  .thumbnail {
    width: 100%;
    max-width: 250px;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
  }
  .name {
    width: 100%;
    height: 67px;
  }
  .needs {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 5px;
    .row {
      width: 100%;
      height: 20px;
    }
  }
  .actions {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .icon {
      height: 30px;
      width: 30px;
      border-radius: 50%;
    }
    .group {
      display: flex;
      gap: 5px;
    }
  }
  .loading-gradient {
    background-image: linear-gradient(90deg, #f6f6f6 0px, #fafafa 100px, #f6f6f6 300px);
    background-size: 100vw 100%;
    animation: shine 1.5s infinite ease-in-out;
  }
  @keyframes shine {
    0% {
      background-position-x: -20vw;
    }
    100% {
      background-position-x: 85vw;
    }
  }
`
