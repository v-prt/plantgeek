import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'
import { Provider } from 'react-redux'
import configureStore from './store'
import { UserProvider } from './contexts/UserContext'
import { PlantProvider } from './contexts/PlantContext'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

// set default behavior of query client to only fetch once on render and when stale after 3 hours
// const threeHours = 1000 * 60 * 60 * 3
const queryClient = new QueryClient({
  // defaultOptions: {
  //   queries: {
  //     refetchOnWindowFocus: false,
  //     refetchOnmount: false,
  //     refetchOnReconnect: false,
  //     retry: false,
  //     staleTime: threeHours,
  //   },
  // },
})

const store = configureStore()

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <UserProvider>
        <PlantProvider>
          <App />
        </PlantProvider>
      </UserProvider>
    </Provider>
    <ReactQueryDevtools initialIsOpen={false} position='bottom-left' />
  </QueryClientProvider>,
  document.getElementById('root')
)
