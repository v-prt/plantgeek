import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'
import { Provider } from 'react-redux'
import configureStore from './store'
import { UserProvider } from './contexts/UserContext'
import {
  // useQuery,
  // useMutation,
  // useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

const queryClient = new QueryClient()

const store = configureStore()

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <UserProvider>
        <App />
      </UserProvider>
    </Provider>
    <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
  </QueryClientProvider>,
  document.getElementById('root')
)
