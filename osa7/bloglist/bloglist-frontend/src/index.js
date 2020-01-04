
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'
import store from './store'
import { Provider } from 'react-redux'
import { Container } from 'semantic-ui-react'

ReactDOM.render(
  <Provider store={store} >
    <Container>
      <App />
    </Container>
  </Provider>,
  document.getElementById('root'))