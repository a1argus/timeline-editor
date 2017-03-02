import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import c from './modules/const'
import {yearsToZoom} from './modules/utils'

import reducer from './reducers'
import App from './containers/App'


const middleware = [ thunk ]

if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger())
}

    

let {translateY, scaleY} = yearsToZoom({year1: c.defaultYear1, year2: c.defaultYear2})
const store = createStore(
    reducer,
    {
        items: [],
        zoom: {
            translateX: 0,
            translateY,
            scaleX: 1,
            scaleY
        },
        animation: { duration: 500 }
    },    
    applyMiddleware(...middleware)
)

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)
