import React, { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { RiImageAddFill, RiImageAddLine } from 'react-icons/ri'
import styled from 'styled-components/macro'
import { COLORS } from '../GlobalStyles'
import { Button } from '../components/ReusableComponents'
import { ImCross } from 'react-icons/im'
import maranta from '../assets/maranta.jpeg'

export const DropZone = () => {
  const [images, setImages] = useState([])

  const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  }

  const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box',
  }

  const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden',
  }

  const img = {
    display: 'block',
    width: 'auto',
    height: '100%',
  }

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    accept: 'image/*',
    multiple: true,
    onDrop: (acceptedFiles) => {
      setImages(
        acceptedFiles.map((image) =>
          Object.assign(image, {
            preview: URL.createObjectURL(image),
          })
        )
      )
    },
  })

  const thumbs = images.map((image) => (
    <div style={thumb} key={image.name}>
      <div style={thumbInner}>
        <img src={image.preview} style={img} alt='' />
      </div>
    </div>
  ))

  useEffect(
    () => () => {
      // revokes the data uris to avoid memory leaks
      images.forEach((image) => URL.revokeObjectURL(image.preview))
    },
    [images]
  )

  const submitImages = () => {
    const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/upload`
    images.forEach(async (image) => {
      const formData = new FormData()
      formData.append('file', image)
      formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET)
      // FIXME: Moderation parameter is not allowed when using unsigned upload
      formData.append('moderation', 'manual')
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      console.log(data)
      // TODO: get public_id from cloudinary response and save image to plant db if image approved
    })
  }

  return (
    // TODO:
    // add remove button to plant image which clears state and brings back dropzone so user can change the image?
    // set up signed uploads with cloudinary
    // set up a way to approve images before saving to db (cloudinary analysis using amazon rekognition, must be plant and pass guidelines, no offensive content)
    <Wrapper>
      <p>Please follow our image standards:</p>
      <ul>
        <li key={1}>- houseplants only</li>
        <li key={2}>- 1:1 aspect ratio (square)</li>
        <li key={3}>- display the whole plant in a plain pot</li>
        <li key={4}>- white background</li>
        <li>- well lit and in focus (no blurry images)</li>
        <li>- max filesize: 1mb</li>
      </ul>
      <p>Example:</p>
      <img style={{ height: '200px' }} src={maranta} alt='' />
      <DropBox {...getRootProps()} isDragAccept={isDragAccept} isDragReject={isDragReject}>
        <input {...getInputProps()} />
        <Icon>
          {isDragAccept && <RiImageAddFill />}
          {isDragReject && <ImCross />}
          {!isDragActive && <RiImageAddLine />}
        </Icon>
      </DropBox>
      <aside style={thumbsContainer}>{thumbs}</aside>
      <Button onClick={() => submitImages()}>Submit Images</Button>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  margin: 50px;
`

const DropBox = styled.div`
  background: ${(props) =>
    props.isDragAccept ? `rgba(255,255,255,0.8)` : `rgba(255,255,255,0.4)`};
  border: 2px dotted ${COLORS.medium};
  border: ${(props) => (props.isDragAccept ? `2px solid ${COLORS.light}` : ``)};
  border: ${(props) => props.isDragReject && '2px solid red'};
  color: ${COLORS.medium};
  color: ${(props) => props.isDragAccept && `${COLORS.light}`};
  color: ${(props) => props.isDragReject && 'red'};
  margin: 10px 0;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 150px;
  width: 150px;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.8);
    border: 2px solid ${COLORS.light};
    color: ${COLORS.light};
  }
`

const Icon = styled.div`
  font-size: 4rem;
`
