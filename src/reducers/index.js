import { combineReducers } from 'redux'
import { limitsToTransform1D } from '../modules/transforms'
import update from 'react-addons-update'
import _ from 'lodash'
import moment from 'moment'

import {
    RECEIVE_DATA,
    REQUEST_DATA,
    CHANGE_TRANSFORM,
    DRAG_SCREEN,
    DRAG_TIMELINE,
    SELECT_EPOCH,
    UNSELECT_EPOCH
} from '../actions'

let timelineId = 0

const data = (state = {}, action) => {
    switch (action.type) {
    case RECEIVE_DATA:
        let timelines = action.data.map(timeline => {
            let epochs = timeline.map(epoch => ({
                name: epoch.name.substring(0, 99),
                dateStart: moment(epoch.year1, 'Y'),
                dateFinish: moment(epoch.year2, 'Y'),
            }))
            return {id: timelineId++, x: 100, epochs}
        })
        return  {files: ['start.tsv'], timelines: _.keyBy(timelines, 'id')} 
    case DRAG_TIMELINE:
        return update(state, {
            timelines: {
                [action.id]: {
                    x: {$apply: x => x + action.dx}
                }
            }                
        }) 
    case REQUEST_DATA:
        return state
    default:
        return state
    }
}

const transform = (state = {}, action) => {
    switch (action.type) {
        case CHANGE_TRANSFORM:
            let {translate, scale} = limitsToTransform1D(action.limits, action.screenLimits)
            return {...state, translateY: translate, scaleY: scale}
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
        case CHANGE_TRANSFORM:
            return {...state, duration: 500}
        case DRAG_SCREEN:
            return {...state, duration: 0}
        default:
            return state
    }
}

const selection = (state = {visible: false}, action) => {
    switch (action.type) {
        case SELECT_EPOCH:
            return {...state, ..._.omit(action, 'type'), visible: true}
        case UNSELECT_EPOCH:
            return {...state, visible: false }
        default:
            return state
    }
}

const screen = (state = {}, action) => {
    switch (action.type) {
        default:
            return state
    }
}


const rootReducer = combineReducers({
  data,
  transform,
  animation,
  selection,
  screen  
})

export default rootReducer
