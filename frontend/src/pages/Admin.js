import { useContext, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { API_URL } from '../constants'
import { useQuery } from 'react-query'
import axios from 'axios'
import { UserContext } from '../contexts/UserContext'
import styled from 'styled-components/macro'
import { Empty } from 'antd'
import { Ellipsis } from '../components/loaders/Ellipsis'
import { FadeIn } from '../components/loaders/FadeIn'
import { PlantCard } from '../components/PlantCard'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { AllReports } from '../components/reports/AllReports'
import { COLORS, BREAKPOINTS } from '../GlobalStyles'
import { MdOutlineAdminPanelSettings } from 'react-icons/md'

export const Admin = () => {
  useDocumentTitle('Admin • plantgeek')
  const [tab, setTab] = useState('contributions')
  const { currentUser } = useContext(UserContext)

  // TODO: pagination for plants to review
  const { data, status } = useQuery(['plants-to-review'], async () => {
    const { data } = await axios.get(`${API_URL}/plants-to-review`)
    return data.plants
  })

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
                data.length > 0 ? (
                  <>
                    <div className='plants'>
                      {data.map(plant => (
                        <PlantCard key={plant._id} plant={plant} />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className='empty'>
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description='No contributions pending'
                    />
                  </div>
                )
              ) : (
                <div className='loading'>
                  <Ellipsis />
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
    /* background: #fff; */
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
    align-items: center;
    gap: 10px;
    .toggle-btn {
      margin-left: auto;
      background: #ddd;
      flex: 1;
      border-radius: 10px 10px 0 0;
      padding: 10px;
      font-weight: bold;
      color: #999;
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
    .empty,
    .loading {
      display: grid;
      place-content: center;
    }
    .empty,
    .loading,
    .plants {
      height: 100%;
    }
    .plants {
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
