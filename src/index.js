import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import { limitsToTransform1D } from './modules/transforms'

import reducer from './reducers'
import App from './containers/App'


const middleware = [ thunk ]

if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger())
}

const initialScreenSize = {width: 1000, height: 800}

let {translate, scale} = limitsToTransform1D([1200, 1700], [0, initialScreenSize.height])
const store = createStore(
    reducer,
    {
        data: {
            files: [],
            timelines: {}
        },
        transform: {
            translateX: 0,
            translateY: translate,
            scaleX: 1,
            scaleY: scale
        },
        animation: { duration: 500 },
        screen: {size: initialScreenSize}
    },    
    applyMiddleware(...middleware)
)

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)
