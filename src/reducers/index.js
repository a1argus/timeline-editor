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
    UNSELECT_EPOCH,
    REQUEST_FILE,
    RECEIVE_FILE,
    CLEAR_FILE,
    CLEAR_ALL,
    HIDE_FILE,
    UNHIDE_FILE
} from '../actions'

let timelineId = 0
let fileId = 0

const data = (state = {}, action) => {
    let timelines
    switch (action.type) {
    case RECEIVE_DATA:
        timelines = action.data.map(timeline => {
            let epochs = timeline.map(epoch => ({
                name: epoch.name.substring(0, 99),
                dateStart: moment(epoch.year1, 'Y'),
                dateFinish: moment(epoch.year2, 'Y'),
            }))
            return {id: timelineId++, x: 100, epochs}
        })
        return  {
            files:  _.keyBy([{name: 'start.tsv', isLoading: false}], 'name'),
            timelines: _.keyBy(timelines, 'id')
        }
    case RECEIVE_FILE:
        timelines = action.timelines.map(timeline => {
            let epochs = timeline.map(epoch => ({
                name: epoch.name.substring(0, 99),
                dateStart: moment(epoch.year1, 'Y'),
                dateFinish: moment(epoch.year2, 'Y'),
            }))
            return {id: timelineId++, fileName: action.fileName, hidden: false, x: 100, epochs}
        })
        return update(state, {
            files: {
                [action.fileName]: {
                    isLoading: {
                        $set: false
                    },
                    id: {
                        $set: fileId++
                    }
                }
            },
            timelines: {
                $merge: _.keyBy(timelines, 'id')
            }    
        })
    case REQUEST_FILE:
        if(action.fileName in state) { return state }
        return update(state, {
            files: {
                $merge: {
                    [action.fileName]: {
                        id: fileId++,
                        name: action.fileName,
                        hidden: false,
                        isLoading: true
                    }
                }
            }
        })
    case CLEAR_FILE:
        return update(state, {
            files: {
                $apply: x => _.omit(x, action.fileName)
            },
            timelines: {
                $apply: x => _.omitBy(x, timeline => timeline.fileName === action.fileName)
            }
        })
    case CLEAR_ALL:
        return update(state, {
            files: {
                $set: {}
            },
            timelines: {
                $set: {}
            }
        })
    case HIDE_FILE:
        return update(state, {
            files: {
                [action.fileName]: {
                    hidden: {
                        $set: true
                    }
                }
            },
            timelines: {
                $apply: x => _.keyBy(_.values(x).map(timeline => {
                    let timelineNew = _.clone(timeline)
                    if(timeline.fileName === action.fileName) { timelineNew.hidden = true }
                    return timelineNew
                }), 'id')
            }
        })
    case UNHIDE_FILE:
        return update(state, {
            files: {
                [action.fileName]: {
                    hidden: {
                        $set: false
                    }
                }
            },
            timelines: {
                $apply: x => _.keyBy(_.values(x).map(timeline => {
                    let timelineNew = _.clone(timeline)
                    if(timeline.fileName === action.fileName) { timelineNew.hidden = false }
                    return timelineNew
                }), 'id')
            }
        })        
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
