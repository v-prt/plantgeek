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

export const ActionBox = ({ plant }) => {
  const plantId = plant._id
  const queryClient = new useQueryClient()
  const { currentUser } = useContext(UserContext)

  const handleSubmit = async values => {
    console.log(values)
    try {
      await axios.post(`${API_URL}/lists/${currentUser._id}`, values)
      queryClient.invalidateQueries('plant')
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
        {({ values, setFieldValue, submitForm }) => (
          <Form>
            <div className='user-lists'>
              <p className='popularity-info'>
                This plant is in <b>{plant.owned?.length} collections</b> and{' '}
                <b>{plant.wanted?.length} wishlists</b>.
              </p>
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
                <div className='label collection'>
                  <span className='icon'>
                    <RiPlantLine />
                  </span>
                  {values.collection?.includes(plantId) ? 'Remove from' : 'Add to'} collection
                </div>
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
                <div className='label wishlist'>
                  <span className='icon'>
                    <AiOutlineStar />
                  </span>
                  {values.wishlist?.includes(plantId) ? 'Remove from' : 'Add to'} wishlist
                </div>
              </Checkbox>
            </div>
            <div className='hearts'>
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
                <div className='label heart'>
                  <span className='icon'>
                    <TiHeart />
                  </span>
                  {values.hearts?.length || 0} heart{values.hearts?.length !== 1 && 's'}
                </div>
              </Checkbox>
            </div>
          </Form>
        )}
      </Formik>
    </Wrapper>
  ) : (
    <Wrapper className='logged-out'>
      <div className='user-lists'>
        <div className={`label collection ${plant.totalOwned && 'opaque'}`}>
          <span className='icon'>
            <RiPlantLine />
          </span>
          In {plant.totalOwned} collection{plant.totalOwned !== 1 && 's'}
        </div>
        <div className={`label wishlist ${plant.totalWanted && 'opaque'}`}>
          <span className='icon'>
            <AiOutlineStar />
          </span>
          In {plant.totalWanted} wishlist{plant.totalWanted !== 1 && 's'}
        </div>
      </div>
      <div className='hearts'>
        <div className={`label heart ${plant.hearts?.length && 'opaque'}`}>
          <span className='icon'>
            <TiHeart />
          </span>
          {plant.hearts?.length || 0} heart{plant.hearts?.length !== 1 && 's'}
        </div>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.section`
  background: #fff;
  form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    label {
      width: fit-content;
    }
    .ant-checkbox-wrapper {
      margin: 0;
      .label {
        opacity: 0.5;
        transition: 0.2s ease-in-out;
      }
      &:hover,
      &:focus {
        .label {
          opacity: 1;
        }
      }
    }
    .ant-checkbox-wrapper-checked {
      .label {
        opacity: 1;
        &.heart {
          .icon {
            color: ${COLORS.accent};
          }
        }
        &.collection {
          .icon {
            background: ${COLORS.light};
          }
        }
        &.wishlist {
          .icon {
            background: #ffd24d;
          }
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
      flex-direction: column;
      gap: 10px;
    }
    .popularity-info {
      margin-bottom: 20px;
    }
    .label {
      display: flex;
      align-items: center;
      gap: 5px;
      width: fit-content;
      cursor: pointer;
    }
    .icon {
      border-radius: 50%;
      height: 30px;
      width: 30px;
      display: grid;
      place-content: center;
      font-size: 1.3rem;
    }
    .hearts {
      margin-top: 40px;
    }
  }

  // LOGGED OUT (no form)
  &.logged-out {
    .user-lists {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .label {
      display: flex;
      align-items: center;
      gap: 5px;
      opacity: 0.5;
      .icon {
        border-radius: 50%;
        height: 30px;
        width: 30px;
        display: grid;
        place-content: center;
        font-size: 1.3rem;
      }
      &.opaque {
        opacity: 1;
        &.heart {
          .icon {
            color: ${COLORS.accent};
          }
        }
        &.collection {
          .icon {
            background: ${COLORS.light};
          }
        }
        &.wishlist {
          .icon {
            background: #ffd24d;
          }
        }
      }
    }
    .hearts {
      margin-top: 40px;
    }
  }
`
