import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useInfiniteQuery } from 'react-query'
import axios from 'axios'
import styled from 'styled-components/macro'
import { API_URL } from '../../constants'
import { Empty } from 'antd'
import { ImageLoader } from '../loaders/ImageLoader'
import { Ellipsis } from '../loaders/Ellipsis'

export const Contributions = ({ currentUser, reviewStatus }) => {
  const scrollRef = useRef()
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
    useInfiniteQuery(
      [`${reviewStatus}-contributions`, currentUser._id],
      async ({ pageParam }) => {
        const res = await axios.get(
          `${API_URL}/contributions/${currentUser._id}/${pageParam || 1}`,
          {
            params: { review: reviewStatus },
          }
        )
        return res.data
      },
      {
        getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
      }
    )

  const handleScroll = () => {
    const scrollDistance = scrollRef.current.scrollTop
    const outerHeight = scrollRef.current.offsetHeight
    const innerHeight = scrollRef.current.scrollHeight
    const actualDistance = innerHeight - (scrollDistance + outerHeight)
    if (actualDistance < 100 && hasNextPage && !isFetching) {
      fetchNextPage()
    }
  }

  return (
    <Wrapper>
      <h3>
        {reviewStatus} ({data?.pages[0]?.totalResults})
      </h3>
      {status === 'success' ? (
        data?.pages[0]?.totalResults > 0 ? (
          <>
            <div className='plants' onScroll={handleScroll} ref={scrollRef}>
              {data.pages.map((group, i) =>
                group.contributions.map(plant => (
                  <Link className='contribution-card' to={`/plant/${plant.slug}`} key={plant._id}>
                    <div className='thumbnail'>
                      <ImageLoader src={plant.imageUrl} alt={''} borderRadius='50%' />
                    </div>
                    <div className='info'>
                      <p className='primary-name'>{plant.primaryName.toLowerCase()}</p>
                      <p className='secondary-name'>{plant.secondaryName.toLowerCase()}</p>
                    </div>
                  </Link>
                ))
              )}
              {isFetchingNextPage && (
                <div className='fetching-more'>
                  <Ellipsis />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className='empty'>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={`No ${reviewStatus} contributions.`}
            />
          </div>
        )
      ) : (
        <div className='loading'>
          <Ellipsis />
        </div>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  margin-top: 40px;
  .empty,
  .loading,
  .plants {
    border: 1px solid #e6e6e6;
    border-radius: 10px;
    margin: 10px 0;
  }
  .fetching-more,
  .loading {
    padding: 20px;
    display: grid;
    place-content: center;
  }
  .fetching-more {
    border-top: 1px solid #e6e6e6;
  }
  .plants {
    max-height: 400px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    ::-webkit-scrollbar {
      width: 10px;
    }
    ::-webkit-scrollbar-track {
      background-color: #eee;
      border-radius: 5px;
    }
    ::-webkit-scrollbar-thumb {
      background-color: #ddd;
      border-radius: 5px;
      cursor: pointer;
    }
    .contribution-card {
      width: 100%;
      border-top: 1px solid #e6e6e6;
      padding: 10px;
      display: flex;
      align-items: center;
      gap: 10px;
      &:first-child {
        border: none;
      }
      img {
        height: 75px;
        width: 75px;
        border-radius: 50%;
      }
      .info {
        display: flex;
        flex-direction: column;
        gap: 5px;
        .primary-name {
          font-size: 1rem;
          font-weight: bold;
          color: #222;
          line-height: 1.2;
        }
        .secondary-name {
          color: #666;
          font-size: 0.8rem;
          font-style: italic;
        }
      }
      &:hover {
        background: #f6f6f6;
        .info .primary-name {
          color: #222;
        }
      }
    }
  }
`
