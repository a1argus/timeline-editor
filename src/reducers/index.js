import { combineReducers } from 'redux'

import {
    TEMPLATE
} from '../actions'

const items = (state = [], action) => {
  switch (action.type) {
    case TEMPLATE:
      return action.items.slice()
    default:
      return state
  }
}


const rootReducer = combineReducers({
  items
})

export default rootReducer
