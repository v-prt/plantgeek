import React, { useState, useEffect } from 'react'
import styled from 'styled-components/macro'

export const ImageLoader = ({ src, alt, placeholder, borderRadius }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  // const [validUrl, setValidUrl] = useState(undefined)

  // useEffect(() => {
  //   // resetting default values
  //   setImageLoaded(false)
  //   setValidUrl(undefined)
  //   // validating src/url
  //   if (src) {
  //     fetch(src, { method: 'HEAD' })
  //       .then(res => {
  //         if (res.ok) {
  //           setValidUrl(true)
  //         } else {
  //           setValidUrl(false)
  //         }
  //       })
  //       .catch(() => {
  //         setValidUrl(false)
  //       })
  //   } else {
  //     setValidUrl(false)
  //   }
  //   // cleanup
  //   return () => {
  //     setImageLoaded(false)
  //     setValidUrl(undefined)
  //   }
  // }, [src])

  useEffect(() => {
    const image = new Image()
    image.src = src
    image.onload = () => setImageLoaded(true)
  })

  return (
    <Wrapper>
      {!imageLoaded && <div className='preloader' style={{ borderRadius }} />}
      <img
        src={src}
        alt={alt}
        className={`smooth-image ${imageLoaded ? 'visible' : 'hidden'}`}
        style={{ borderRadius }}
      />
    </Wrapper>
    // <Wrapper style={{ borderRadius }}>
    //   {validUrl === false ? (
    //     <>
    //       <img
    //         src={placeholder}
    //         alt={alt}
    //         className={`placeholder smooth-image ${imageLoaded ? 'visible' : 'hidden'}`}
    //         onLoad={() => setImageLoaded(true)}
    //       />
    //       {!imageLoaded && (
    //         <div className='smooth-preloader'>
    //           <span className='loader' />
    //         </div>
    //       )}
    //     </>
    //   ) : (
    //     <>
    //       <img
    //         src={src}
    //         alt={alt}
    //         className={`smooth-image ${imageLoaded ? 'visible' : 'hidden'}`}
    //         onLoad={() => setImageLoaded(true)}
    //       />
    //       {!imageLoaded && (
    //         <div className='smooth-preloader'>
    //           <span className='loader' />
    //         </div>
    //       )}
    //     </>
    //   )}
    // </Wrapper>
  )
}

const Wrapper = styled.div`
  /* border-radius: 50%; */
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  overflow: hidden;
  position: relative;
  .smooth-image {
    transition: opacity 0.5s;
  }
  .visible {
    opacity: 1;
  }
  .hidden {
    opacity: 0;
  }
  .preloader {
    height: 100%;
    width: 100%;
    border-radius: 10px;
    background-image: linear-gradient(90deg, #f2f2f2 0px, #fafafa 100px, #f2f2f2 300px);
    background-size: 100vw 100%;
    animation: shine 1.5s infinite ease-in-out;
    position: absolute;
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
