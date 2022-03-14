import React, { useState } from 'react'
import styled from 'styled-components/macro'

export const ImageLoader = ({ src, alt, placeholder }) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  // TODO: check if image url is valid to display placeholder instead of broken image
  // const [validUrl, setValidUrl] = useState(undefined)

  // useEffect(() => {
  //   if (src) {
  //     fetch(src, { method: 'HEAD' })
  //       .then(res => {
  //         if (res.ok) {
  //           setValidUrl(true)
  //           setImageLoading(false)
  //         } else {
  //           setValidUrl(false)
  //           setImageLoading(false)
  //         }
  //       })
  //       .catch(err => {
  //         console.log(err)
  //       })
  //   }
  // }, [src])

  return (
    <Wrapper>
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
    </Wrapper>
  )
}

const Wrapper = styled.div`
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
