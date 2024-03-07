import { useState, useEffect, useContext } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from 'react-query'
import { API_URL } from '../constants.js'
import { Modal, Alert, Button, Drawer, Carousel } from 'antd'
import { UserContext } from '../contexts/UserContext.jsx'
import { PlantContext } from '../contexts/PlantContext.jsx'
import axios from 'axios'
import styled from 'styled-components'
import { COLORS, BREAKPOINTS } from '../GlobalStyles.js'
import { EditOutlined, DeleteOutlined, FlagOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { MdOutlineAdminPanelSettings } from 'react-icons/md'
import { BeatingHeart } from '../components/loaders/BeatingHeart.jsx'
import { FadeIn } from '../components/loaders/FadeIn.jsx'
import { ImageLoader } from '../components/loaders/ImageLoader.jsx'
import placeholder from '../assets/plant-placeholder.svg'
import sun from '../assets/sun.svg'
import water from '../assets/water.svg'
import temp from '../assets/temp.svg'
import humidity from '../assets/humidity.svg'
import { ActionBox } from '../components/ActionBox.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { PlantCard } from '../components/PlantCard.jsx'
import { Ellipsis } from '../components/loaders/Ellipsis.jsx'
import { PlantEditor } from '../components/PlantEditor.jsx'
import { SubmitReport } from '../components/SubmitReport.jsx'
import { SinglePlantReports } from '../components/reports/SinglePlantReports.jsx'

export const PlantProfile = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { currentUser } = useContext(UserContext)
  const [difficulty, setDifficulty] = useState()
  const [editDrawerOpen, setEditDrawerOpen] = useState(false)
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const { setDuplicatePlant } = useContext(PlantContext)

  const { data: plant, status } = useQuery(['plant', slug], async () => {
    try {
      const { data } = await axios.get(`${API_URL}/plant/${slug}`)
      return data.plant
    } catch (err) {
      if (err.response.status === 404) return null
    }
  })

  const { data: similarPlants, status: similarPlantsStatus } = useQuery(
    ['similar-plants', slug],
    async () => {
      const { data } = await axios.get(`${API_URL}/similar-plants/${slug}`)
      return data.similarPlants
    }
  )

  useDocumentTitle(plant?.primaryName ? `${plant?.primaryName}` : 'plantgeek')

  // setting plant care difficulty
  useEffect(() => {
    if (plant && plant.light && plant.water && plant.temperature && plant.humidity) {
      let lightLevel = 0
      let waterLevel = 0
      let temperatureLevel = 0
      let humidityLevel = 0
      if (plant.light === 'low to bright indirect') {
        lightLevel = 0
      } else if (plant.light === 'medium to bright indirect') {
        lightLevel = 1
      } else if (plant.light === 'bright indirect') {
        lightLevel = 2
      }
      if (plant.water === 'low') {
        waterLevel = 0
      } else if (plant.water === 'low to medium') {
        waterLevel = 1
      } else if (plant.water === 'medium') {
        waterLevel = 2
      } else if (plant.water === 'medium to high') {
        waterLevel = 3
      } else if (plant.water === 'high') {
        waterLevel = 4
      }
      if (plant.temperature === 'average') {
        temperatureLevel = 0
      } else if (plant.temperature === 'above average') {
        temperatureLevel = 1
      }
      if (plant.humidity === 'low') {
        humidityLevel = 1
      } else if (plant.humidity === 'medium') {
        humidityLevel = 2
      } else if (plant.humidity === 'high') {
        humidityLevel = 3
      }
      let total = lightLevel + waterLevel + temperatureLevel + humidityLevel
      // lowest = 0
      // highest = 12
      if (total <= 3) {
        setDifficulty('easy')
      } else if (total <= 6) {
        setDifficulty('moderate')
      } else if (total <= 12) {
        setDifficulty('hard')
      }
    }
  }, [plant])

  // DELETE PLANT (ADMIN)
  const handleDelete = plantId => {
    navigate('/browse')
    axios.delete(`${API_URL}/plants/${plantId}`).catch(err => console.log(err))
    queryClient.invalidateQueries('plants')
    queryClient.invalidateQueries('plants-to-review')
    // FIXME: pending-plants count doesn't refetch for a while
    queryClient.invalidateQueries('pending-plants')
  }

  const settings = {
    dots: similarPlants?.length > 1 ? true : false,
    infinite: true,
    speed: 500,
    slidesToShow: similarPlants?.length >= 3 ? 3 : similarPlants?.length,
    slidesToScroll: 1,
    pauseOnHover: true,
    autoplay: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: similarPlants?.length >= 2 ? 2 : 1,
        },
      },
      {
        breakpoint: 550,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  }

  return (
    <Wrapper>
      {status === 'success' ? (
        plant ? (
          <>
            {plant.review === 'pending' && (
              <div className='review-pending'>
                <Alert
                  type='warning'
                  message='This plant is pending review by an admin.'
                  showIcon
                />
              </div>
            )}
            {plant.review === 'rejected' && (
              <div className='review-pending'>
                <Alert
                  type='error'
                  message='This plant has been rejected by an admin. The information may be incorrect or is a duplicate.'
                  showIcon
                />
              </div>
            )}
            <FadeIn>
              <section className='heading'>
                <h1>{plant.primaryName?.toLowerCase()}</h1>
                {plant.secondaryName && (
                  <p className='secondary-name'>{plant.secondaryName.toLowerCase()}</p>
                )}
              </section>
            </FadeIn>

            <FadeIn delay={200}>
              <section className='plant-info'>
                <div className='primary-image'>
                  <ImageLoader
                    src={plant.imageUrl}
                    alt=''
                    placeholder={placeholder}
                    borderRadius='10px'
                  />
                  {/* TODO: gallery here */}
                </div>

                {/* PLANT NEEDS */}
                <Info>
                  <div className='needs'>
                    <div className='row'>
                      <img src={sun} alt='' />
                      <div className='column'>
                        <p>{plant.light || 'unknown'}</p>
                        <Bar>
                          {plant.light === 'low to bright indirect' && <Indicator level={'1'} />}
                          {plant.light === 'medium to bright indirect' && <Indicator level={'2'} />}
                          {plant.light === 'bright indirect' && <Indicator level={'3'} />}
                        </Bar>
                      </div>
                    </div>
                    <div className='row'>
                      <img src={water} alt='' />
                      <div className='column'>
                        <p>{plant.water || 'unknown'}</p>
                        <Bar>
                          {plant.water === 'low' && <Indicator level={'1'} />}
                          {plant.water === 'low to medium' && <Indicator level={'1-2'} />}
                          {plant.water === 'medium' && <Indicator level={'2'} />}
                          {plant.water === 'medium to high' && <Indicator level={'2-3'} />}
                          {plant.water === 'high' && <Indicator level={'3'} />}
                        </Bar>
                      </div>
                    </div>
                    <div className='row'>
                      <img src={temp} alt='' />
                      <div className='column'>
                        <p>
                          {plant.temperature === 'average'
                            ? 'average (55-75°F)'
                            : plant.temperature === 'above average'
                            ? 'above average (65-85°F)'
                            : plant.temperature || 'unknown'}
                        </p>
                        <Bar>
                          {plant.temperature === 'average' && <Indicator level={'2'} />}
                          {plant.temperature === 'above average' && <Indicator level={'2-3'} />}
                        </Bar>
                      </div>
                    </div>
                    <div className='row'>
                      <img src={humidity} alt='' />
                      <div className='column'>
                        <p>
                          {plant.humidity === 'low'
                            ? 'low (30-40%)'
                            : plant.humidity === 'medium'
                            ? 'medium (40-50%)'
                            : plant.humidity === 'high'
                            ? 'high (50-60%+)'
                            : plant.humidity || 'unknown'}
                        </p>
                        <Bar>
                          {plant.humidity === 'low' && <Indicator level={'1'} />}
                          {plant.humidity === 'medium' && <Indicator level={'2'} />}
                          {plant.humidity === 'high' && <Indicator level={'3'} />}
                        </Bar>
                      </div>
                    </div>
                  </div>

                  <div className='misc-info'>
                    <div className={`difficulty ${difficulty}`}>
                      {difficulty
                        ? difficulty === 'easy'
                          ? 'Easy care'
                          : difficulty === 'moderate'
                          ? 'Moderate difficulty'
                          : difficulty === 'hard'
                          ? 'Difficult'
                          : 'Unknown difficulty'
                        : 'Unknown difficulty'}
                    </div>
                    <div
                      className={`toxicity ${
                        plant.toxic === true
                          ? 'toxic'
                          : plant.toxic === false
                          ? 'nontoxic'
                          : 'unkown'
                      }`}
                    >
                      {plant.toxic === true
                        ? 'Toxic'
                        : plant.toxic === false
                        ? 'Non-toxic'
                        : 'Toxicity unknown'}
                    </div>
                    <div className={`climate ${!plant.climate && 'unknown'}`}>
                      {plant.climate || 'Unknown climate'}
                    </div>
                    <div className={`rarity ${!plant.rarity && 'unknown'}`}>
                      {plant.rarity || 'Unknown rarity'}
                    </div>
                  </div>
                  <p>
                    <b>Region of origin:</b> {plant.origin || 'Unknown'}
                  </p>
                  <div className='links'>
                    <Link to='/care' className='link'>
                      Care Tips
                    </Link>
                    {plant.sourceUrl && (
                      <>
                        •
                        <a
                          className='source-link'
                          href={plant.sourceUrl}
                          target='_blank'
                          rel='noopenner noreferrer'
                        >
                          Source
                        </a>
                      </>
                    )}
                  </div>
                </Info>
              </section>
            </FadeIn>

            <FadeIn delay={400}>
              <div className='actions'>
                {/* COLLECTION / WISHLIST / HEARTS */}
                {plant.review !== 'pending' && plant.review !== 'rejected' && (
                  <ActionBox plant={plant} />
                )}

                {/* REPORT PLANT */}
                <section className='reports-section'>
                  <h3>See something wrong?</h3>
                  <p>
                    Please let us know if you have a suggestion for this plant or want to report
                    incorrect information.
                  </p>
                  <Button type='primary' onClick={() => setReportModalOpen(true)}>
                    <FlagOutlined /> REPORT PLANT
                  </Button>
                  <Modal
                    open={reportModalOpen}
                    footer={null}
                    destroyOnClose
                    onCancel={() => setReportModalOpen(false)}
                  >
                    <SubmitReport
                      currentUser={currentUser}
                      plantId={plant._id}
                      setReportModalOpen={setReportModalOpen}
                    />
                  </Modal>
                </section>
              </div>
            </FadeIn>

            {/* SIMILAR PLANTS */}
            <FadeIn delay={600}>
              <section className='similar-plants'>
                <h2>similar plants</h2>
                <div className='similar-plants-container'>
                  {similarPlantsStatus === 'success' ? (
                    similarPlants?.length > 0 ? (
                      <Carousel {...settings} style={{ marginBottom: '40px' }}>
                        {similarPlants.map(plant => (
                          <PlantCard key={plant._id} plant={plant} />
                        ))}
                      </Carousel>
                    ) : (
                      <p style={{ textAlign: 'center' }}>No similar plants found.</p>
                    )
                  ) : (
                    <div className='loading'>
                      <Ellipsis />
                    </div>
                  )}
                </div>
              </section>
            </FadeIn>

            {/* ADMIN ONLY */}
            {currentUser?.role === 'admin' && (
              <FadeIn delay={700}>
                <AdminSection>
                  <h3>
                    <MdOutlineAdminPanelSettings /> Admin
                  </h3>

                  <SinglePlantReports plantId={plant._id} />

                  <div className='admin-actions-container'>
                    <div className='edit-btns'>
                      <Button
                        type='primary'
                        icon={<EditOutlined />}
                        onClick={() => setEditDrawerOpen(true)}
                      >
                        EDIT PLANT
                      </Button>
                      <Drawer
                        title='Edit plant'
                        open={editDrawerOpen}
                        onClose={() => setEditDrawerOpen(false)}
                      >
                        <PlantEditor
                          plant={plant}
                          slug={slug}
                          currentUser={currentUser}
                          setEditDrawerOpen={setEditDrawerOpen}
                        />
                      </Drawer>
                      <Button
                        type='secondary'
                        icon={<PlusCircleOutlined />}
                        onClick={() => {
                          setDuplicatePlant(plant)
                          navigate('/contribute')
                        }}
                      >
                        DUPLICATE
                      </Button>
                    </div>
                    <div className='delete-btn'>
                      <Button type='danger' onClick={() => setDeleteModalOpen(true)}>
                        DELETE...
                      </Button>
                      <Modal
                        title='Delete plant'
                        open={deleteModalOpen}
                        footer={false}
                        onCancel={() => setDeleteModalOpen(false)}
                      >
                        <p>
                          Are you sure you want to permanently delete <b>{plant.primaryName}</b>?
                        </p>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                          <Button
                            type='danger'
                            onClick={() => handleDelete(plant._id)}
                            icon={<DeleteOutlined />}
                          >
                            DELETE
                          </Button>
                          <Button type='secondary' onClick={() => setDeleteModalOpen(false)}>
                            CANCEL
                          </Button>
                        </div>
                      </Modal>
                    </div>
                  </div>
                </AdminSection>
              </FadeIn>
            )}
          </>
        ) : (
          <section className='not-found'>
            <img src={placeholder} alt='' />
            <p>Plant not found.</p>
            <Link to='/'>
              <Button type='primary'>Go Home</Button>
            </Link>
          </section>
        )
      ) : (
        <section className='loading'>
          <BeatingHeart />
        </section>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.main`
  .heading {
    background: linear-gradient(45deg, #a4e17d, #95d190);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    .review-pending {
      margin-bottom: 20px;
    }
    h1 {
      line-height: 1;
      font-size: 1.5rem;
    }
    .secondary-name {
      font-size: 1.1rem;
      font-style: italic;
    }
    .buttons {
      display: flex;
      gap: 10px;
    }
    button {
      margin-top: 20px;
    }
  }
  .plant-info {
    background: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    gap: 20px;
    padding: 20px;
    .upload-wrapper {
      flex: 1;
      width: 100%;
      max-width: 400px;
      text-align: center;
      button {
        margin-top: 20px;
      }
    }
    .primary-image {
      display: flex;
      flex: 1;
      width: 100%;
      max-width: 400px;
      aspect-ratio: 1 / 1;
      position: relative;
      img {
        object-fit: cover;
        width: 100%;
        border-radius: 10px;
        aspect-ratio: 1 / 1;
        &.placeholder {
          border-radius: 0;
          width: 80%;
          object-fit: contain;
        }
      }
    }
  }
  .actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .reports-section {
    background: ${COLORS.mutedMedium};
    button {
      margin-top: 20px;
    }
  }
  .similar-plants {
    background: #f2f2f2;
    display: flex;
    flex-direction: column;
    align-items: center;
    h2 {
      text-align: center;
      margin-bottom: 30px;
    }
    .similar-plants-container {
      width: 100%;
      max-width: 960px;
      .slick-slide {
        display: grid;
        place-content: center;
        padding: 10px;
      }
      .slick-dots {
        bottom: -20px;
        li button {
          background: #999 !important;
        }
      }
      @media only screen and (max-width: 768px) {
        max-width: 640px;
      }
      @media only screen and (max-width: 550px) {
        max-width: 320px;
      }
    }
  }
  .loading,
  .not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
  }
  .not-found {
    background: #fff;
    gap: 20px;
    img {
      height: 100px;
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    .heading {
      padding: 30px;
      h1 {
        font-size: 1.8rem;
      }
      .secondary-name {
        font-size: 1.2rem;
      }
    }
    .plant-info {
      flex-direction: row;
      gap: 30px;
      padding: 30px;
    }
    .actions {
      flex-direction: row;
      gap: 20px;
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.desktop}) {
    .heading {
      padding: 40px;
      h1 {
        font-size: 2rem;
      }
      .secondary-name {
        font-size: 1.3rem;
      }
    }
    .plant-info {
      gap: 40px;
      padding: 40px;
    }
    .actions {
      gap: 30px;
    }
  }
`

const Info = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
  .needs {
    display: flex;
    flex-direction: column;
    gap: 20px;
    border-bottom: 1px dotted #ccc;
    padding-bottom: 20px;
  }
  .row {
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    img {
      height: 30px;
      width: 30px;
    }
    .column {
      flex: 1;
      p {
        font-size: 0.8rem;
      }
    }
  }
  .misc-info {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    font-size: 0.9rem;
    .difficulty,
    .toxicity,
    .climate,
    .rarity {
      font-weight: bold;
      font-size: 0.8rem;
      padding: 2px 10px;
      border-radius: 15px;
      background: #eee;
      color: #999;
      &.easy,
      &.nontoxic {
        background: #f1f9eb;
        color: ${COLORS.mediumLight};
      }
      &.moderate {
        background: #fff0e6;
        color: ${COLORS.alert};
      }
      &.hard,
      &.toxic {
        background: #ffe6e6;
        color: ${COLORS.danger};
      }
    }
    .climate {
      background: #deefff;
      color: #027df0;
      text-transform: capitalize;
      &.unknown {
        background: #eee;
        color: #999;
      }
    }
    .rarity {
      background: #efe4ff;
      color: ${COLORS.accent};
      text-transform: capitalize;
      &.unknown {
        background: #eee;
        color: #999;
      }
    }
  }
  .links {
    color: #999;
    display: flex;
    gap: 8px;
    a {
      font-size: 0.8rem;
      text-decoration: underline;
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    .row {
      gap: 15px;
      img {
        height: 35px;
        width: 35px;
      }
      .column {
        p {
          font-size: 1rem;
        }
      }
    }
  }
`

const Bar = styled.div`
  background: rgba(0, 0, 0, 0.1);
  height: 15px;
  border-radius: 10px;
  margin-top: 5px;
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    height: 20px;
  }
`

const Indicator = styled.div`
  background: linear-gradient(to right, ${COLORS.light}, ${COLORS.mediumLight});
  height: 100%;
  border-radius: 10px;
  width: ${props => props.level === '1' && '10%'};
  width: ${props => props.level === '1-2' && '25%'};
  width: ${props => props.level === '2' && '50%'};
  width: ${props => props.level === '2-3' && '75%'};
  width: ${props => props.level === '3' && '100%'};
`

const AdminSection = styled.section`
  background: #fff;
  h3 {
    padding-bottom: 5px;
    border-bottom: 1px solid #e6e6e6;
    margin-bottom: 40px;
  }
  .admin-actions-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    .edit-btns {
      display: flex;
      gap: 12px;
      border-bottom: 1px dotted #ccc;
      padding: 20px 0;
      button {
        flex: 1;
        max-width: 150px;
      }
    }
    .delete-btn {
      display: flex;
    }
  }
  @media only screen and (min-width: ${BREAKPOINTS.tablet}) {
    .admin-actions-container {
      flex-direction: row;
      padding-top: 40px;
      .edit-btns {
        flex: 1;
        border-bottom: none;
        border-right: 1px dotted #ccc;
        padding: 0;
      }
      .delete-btn {
        margin-left: auto;
      }
    }
  }
`
