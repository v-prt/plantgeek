import React, { useState, useEffect } from 'react'
import styled from 'styled-components/macro'

export const ImageLoader = ({ src, alt, placeholder }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [validUrl, setValidUrl] = useState(undefined)

  useEffect(() => {
    if (src) {
      fetch(src, { method: 'HEAD' })
        .then(res => {
          if (res.ok) {
            setValidUrl(true)
          } else {
            setValidUrl(false)
          }
        })
        .catch(err => {
          // FIXME: prevent errs showing in console
          console.log(err)
        })
    }
  }, [src])

  return (
    <Wrapper>
      {validUrl === false ? (
        <>
          <img
            src={placeholder}
            alt={alt}
            className={`placeholder smooth-image image-${imageLoaded ? 'visible' : 'hidden'}`}
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
            className={`smooth-image image-${imageLoaded ? 'visible' : 'hidden'}`}
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
  display: grid;
  .smooth-image {
    transition: opacity 1s;
  }
  .image-visible {
    opacity: 1;
  }
  .image-hidden {
    opacity: 0;
  }
`
