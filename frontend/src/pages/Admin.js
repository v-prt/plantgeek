import { useContext, useState, useRef } from 'react'
import { Redirect } from 'react-router-dom'
import { useInfiniteQuery } from 'react-query'
import { UserContext } from '../contexts/UserContext'
import { PlantContext } from '../contexts/PlantContext'
import styled from 'styled-components/macro'
import { Empty } from 'antd'
import { FadeIn } from '../components/loaders/FadeIn'
import { PlantCard } from '../components/PlantCard'
import { GhostPlantCard } from '../components/GhostPlantCard'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { AllReports } from '../components/reports/AllReports'
import { COLORS, BREAKPOINTS } from '../GlobalStyles'
import { MdOutlineAdminPanelSettings } from 'react-icons/md'

export const Admin = () => {
  useDocumentTitle('Admin • plantgeek')
  const [tab, setTab] = useState('contributions')
  const scrollRef = useRef()
  const { currentUser } = useContext(UserContext)
  const { fetchPendingPlants } = useContext(PlantContext)

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
    useInfiniteQuery(['plants-to-review'], fetchPendingPlants, {
      getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    })

  const handleScroll = () => {
    const scrollDistance = scrollRef.current.scrollTop
    const outerHeight = scrollRef.current.offsetHeight
    const innerHeight = scrollRef.current.scrollHeight
    const actualDistance = innerHeight - (scrollDistance + outerHeight)
    if (actualDistance < 400 && hasNextPage && !isFetching) {
      fetchNextPage()
    }
  }

  return !currentUser || currentUser.role !== 'admin' ? (
    <Redirect to='/' />
  ) : (
    <Wrapper>
      <FadeIn>
        <main className='admin-content'>
          <div className='page-header'>
            <h1>
              <MdOutlineAdminPanelSettings /> Admin
            </h1>
            <div className='tab-toggle'>
              <button
                className={`toggle-btn ${tab === 'contributions' && 'active'}`}
                onClick={() => setTab('contributions')}>
                Contributions
              </button>
              <button
                className={`toggle-btn ${tab === 'reports' && 'active'}`}
                onClick={() => setTab('reports')}>
                Reports
              </button>
            </div>
          </div>
          {tab === 'contributions' && (
            <div className='contributions-tab'>
              {status === 'success' ? (
                data?.pages[0]?.totalResults > 0 ? (
                  <>
                    <div className='plants' ref={scrollRef} onScroll={handleScroll}>
                      {data.pages.map((group, i) =>
                        group.plants.map(plant => <PlantCard key={plant._id} plant={plant} />)
                      )}
                      {isFetchingNextPage && <GhostPlantCard />}
                    </div>
                  </>
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description='No pending contributions.'
                  />
                )
              ) : (
                <div className='loading'>
                  {Array.from(Array(6).keys()).map(item => (
                    <GhostPlantCard key={item} />
                  ))}
                </div>
              )}
            </div>
          )}
          {tab === 'reports' && <AllReports />}
        </main>
      </FadeIn>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  .admin-content {
    gap: 0;
    padding: 0;
    height: calc(100vh - 53px);
    overflow: hidden;
    position: fixed;
    top: 0;
  }
  .page-header {
    width: 100%;
    padding: 20px 20px 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    h1 {
      font-size: 1.2rem;
    }
  }
  .tab-toggle {
    display: flex;
    gap: 10px;
    .toggle-btn {
      background: #ddd;
      flex: 1;
      border-radius: 10px 10px 0 0;
      padding: 10px;
      font-weight: bold;
      color: #999;
      transition: 0.2s ease-in-out;
      &:hover {
        color: #666;
      }
      &.active {
        background: #f4f4f4;
        color: ${COLORS.darkest};
      }
    }
  }
  h2 {
    margin-bottom: 30px;
    text-align: center;
  }
  .contributions-tab {
    background: #f2f2f2;
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 10px;
    .empty {
      display: grid;
      place-content: center;
    }
    .empty,
    .loading,
    .plants {
      height: 100%;
    }
    .loading,
    .plants {
      width: 100%;
      overflow: auto;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 20px;
      padding: 10px;
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
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.desktop}) {
    .admin-content {
      height: 100vh;
      max-width: calc(100vw - 241px);
      right: 0;
      .contributions-tab {
        padding: 20px;
        .plants {
          padding: 10px;
        }
      }
    }
  }
`
