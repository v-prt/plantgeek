import React, { useState, useEffect } from 'react'
import styled from 'styled-components/macro'

export const ImageLoader = ({ src, alt, placeholder }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [validUrl, setValidUrl] = useState(undefined)

  useEffect(() => {
    // resetting default values
    setImageLoaded(false)
    setValidUrl(undefined)
    // validating src/url
    if (src) {
      fetch(src, { method: 'HEAD' })
        .then(res => {
          if (res.ok) {
            setValidUrl(true)
          } else {
            setValidUrl(false)
          }
        })
        .catch(() => {
          setValidUrl(false)
        })
    } else {
      setValidUrl(false)
    }
    // cleanup
    return () => {
      setImageLoaded(false)
      setValidUrl(undefined)
    }
  }, [src])

  return (
    <Wrapper>
      {validUrl === false ? (
        <>
          <img
            src={placeholder}
            alt={alt}
            className={`placeholder smooth-image ${imageLoaded ? 'visible' : 'hidden'}`}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className='smooth-preloader'>
              <span className='loader' />
            </div>
          )}
        </>
      ) : (
        <>
          <img
            src={src}
            alt={alt}
            className={`smooth-image ${imageLoaded ? 'visible' : 'hidden'}`}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className='smooth-preloader'>
              <span className='loader' />
            </div>
          )}
        </>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background: #eee;
  border-radius: 50%;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  overflow: hidden;
  .smooth-image {
    transition: opacity 0.5s;
  }
  .visible {
    opacity: 1;
  }
  .hidden {
    opacity: 0;
  }
`
