import React, { useContext } from 'react'
import axios from 'axios'
import { API_URL } from '../constants'
import { useQueryClient } from 'react-query'
import { UserContext } from '../contexts/UserContext'

import styled from 'styled-components/macro'
import { COLORS } from '../GlobalStyles'
import { RiPlantLine } from 'react-icons/ri'
import { TiHeart } from 'react-icons/ti'
import { AiOutlineStar } from 'react-icons/ai'
// import { BiComment } from 'react-icons/bi'
import { Formik, Form } from 'formik'
import { Checkbox } from 'formik-antd'

export const ActionBar = ({ plant }) => {
  const plantId = plant._id
  const queryClient = new useQueryClient()
  const { currentUser } = useContext(UserContext)

  const handleSubmit = async values => {
    try {
      await axios.post(`${API_URL}/lists/${currentUser._id}`, values)
      queryClient.invalidateQueries('current-user')
      queryClient.invalidateQueries('collection')
      queryClient.invalidateQueries('wishlist')
      // leads to funky behavior when browsing and sorting plants
      // queryClient.invalidateQueries('plants')
    } catch (err) {
      console.log(err)
    }
  }

  const initialValues = {
    plantId,
    hearts: plant.hearts || [],
    owned: plant.owned || [],
    wanted: plant.wanted || [],
    collection: currentUser?.collection || [],
    wishlist: currentUser?.wishlist || [],
  }

  return currentUser ? (
    <Wrapper>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values, setFieldValue, submitForm, isSubmitting }) => (
          <Form>
            <Checkbox
              name='hearts'
              checked={values.hearts?.includes(currentUser._id)}
              onChange={e => {
                setFieldValue(
                  'hearts',
                  e.target.checked
                    ? [...values.hearts, currentUser._id]
                    : values.hearts.filter(id => id !== currentUser._id)
                )
                submitForm()
              }}>
              <span className='icon hearts'>
                <TiHeart />
              </span>
              <span className='num'>{values.hearts?.length || 0}</span>
            </Checkbox>

            <div className='user-lists'>
              <Checkbox
                name='collection'
                checked={values.collection?.includes(plantId)}
                onChange={e => {
                  setFieldValue(
                    'owned',
                    e.target.checked
                      ? [...values.owned, currentUser._id]
                      : values.owned.filter(id => id !== currentUser._id)
                  )
                  setFieldValue(
                    'collection',
                    e.target.checked
                      ? [...values.collection, plantId]
                      : values.collection.filter(id => id !== plantId)
                  )
                  submitForm()
                }}>
                <span className='icon collection'>
                  <RiPlantLine />
                </span>
              </Checkbox>
              <Checkbox
                name='wishlist'
                checked={values.wishlist?.includes(plantId)}
                onChange={e => {
                  setFieldValue(
                    'wanted',
                    e.target.checked
                      ? [...values.wanted, currentUser._id]
                      : values.wanted.filter(id => id !== currentUser._id)
                  )
                  setFieldValue(
                    'wishlist',
                    e.target.checked
                      ? [...values.wishlist, plantId]
                      : values.wishlist.filter(id => id !== plantId)
                  )
                  submitForm()
                }}>
                <span className='icon wishlist'>
                  <AiOutlineStar />
                </span>
              </Checkbox>
            </div>
          </Form>
        )}
      </Formik>
    </Wrapper>
  ) : (
    <Wrapper>
      <div className={`hearts ${plant.hearts?.length && 'liked'}`}>
        <span className='icon'>
          <TiHeart />
        </span>
        <span className='num'>{plant.hearts?.length || 0}</span>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  border-top: 1px dotted #ccc;
  padding-top: 5px;
  form {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .ant-checkbox-wrapper {
      margin: 0;
      .icon {
        opacity: 0.5;
      }
      .num {
        color: #999;
      }
      &:hover,
      &:focus {
        .icon {
          opacity: 1;
        }
      }
    }
    .ant-checkbox-wrapper-checked {
      .icon {
        opacity: 1;
        &.hearts {
          color: ${COLORS.accent};
        }
        &.collection {
          background: ${COLORS.light};
        }
        &.wishlist {
          background: #ffd24d;
        }
      }
    }
    .ant-checkbox {
      display: none;
    }
    .ant-checkbox + span {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 0;
    }
    .user-lists {
      display: flex;
      align-items: center;
      border-radius: 20px;
      gap: 10px;
    }
  }
  .icon {
    border-radius: 50%;
    height: 30px;
    width: 30px;
    display: grid;
    place-content: center;
    font-size: 1.3rem;
    transition: 0.2s ease-in-out;
  }
  .hearts {
    display: flex;
    align-items: center;
    gap: 5px;
    .icon {
      opacity: 0.5;
    }
    .num {
      color: #999;
    }
    &.liked {
      .icon {
        opacity: 1;
        color: ${COLORS.accent};
      }
    }
  }
`
