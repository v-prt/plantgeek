// import { useDispatch } from 'react-redux'
// import axios from 'axios'

// import { requestPlants, receivePlants, requestUsers, receiveUsers } from '../actions.js'

// export const usePlantsFetcher = async () => {
//   const dispatch = useDispatch()
//   dispatch(requestPlants())
//   await axios
//     .get('/plants')
//     .then((res) => dispatch(receivePlants(res.data.data)))
//     .catch((err) => console.log(err))
// }

// export const useUsersFetcher = async () => {
//   const dispatch = useDispatch()
//   dispatch(requestUsers())
//   await axios
//     .get('/users')
//     .then((res) => dispatch(receiveUsers(res.data.data)))
//     .catch((err) => console.log(err))
// }
