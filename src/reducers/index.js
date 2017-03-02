import { combineReducers } from 'redux'
import {yearsToZoom} from '../modules/utils'
import update from 'react-addons-update'

import {
    RECEIVE_DATA,
    REQUEST_DATA,
    CHANGE_ZOOM,
    DRAG_SCREEN,
    DRAG_TIMELINE
} from '../actions'

const items = (state = [], action) => {
    switch (action.type) {
    case RECEIVE_DATA:
        let epochs = action.data.map(epoch => ({
            name: epoch.name.substring(0, 99),
            dateStart: new Date(epoch.year1, 0, 1),
            dateFinish: new Date(epoch.year2, 0, 1),
        }))
        return [{id: 0, x: 100, epochs}]
    case DRAG_TIMELINE:
        return update(state, {
            [action.id]: {
                x: {$apply: x => x + action.dx}
            }   
        }) 
    case REQUEST_DATA:
        return state
    default:
        return state
    }
}

const zoom = (state = {}, action) => {
    switch (action.type) {
        case CHANGE_ZOOM:
            let {translateY, scaleY} = yearsToZoom(action.years)
            return {...state, translateY, scaleY}
        case DRAG_SCREEN:
            return {...state,
                translateX: state.translateX + action.dx / state.scaleX,
                translateY: state.translateY + action.dy / state.scaleY
            }
        default:
            return state
    }
}

const animation = (state = {duration: 500}, action) => {
    switch (action.type) {
        case CHANGE_ZOOM:
            return {...state, duration: 500}
        case DRAG_SCREEN:
            return {...state, duration: 0}
        default:
            return state
    }
}


const rootReducer = combineReducers({
  items,
  zoom,
  animation  
})

export default rootReducer
