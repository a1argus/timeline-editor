import fetch from 'isomorphic-fetch'
import * as d3 from 'd3'

export const
    REQUEST_DATA = 'REQUEST_DATA',
    RECEIVE_DATA = 'RECEIVE_DATA',
    CHANGE_TRANSFORM = 'CHANGE_TRANSFORM',
    DRAG_SCREEN = 'DRAG_SCREEN',
    DRAG_TIMELINE = 'DRAG_TIMELINE',
    SELECT_EPOCH = 'SELECT_EPOCH',
    UNSELECT_EPOCH = 'UNSELECT_EPOCH'

export const changeTransform = (limits, screenLimits) => ({
    type: CHANGE_TRANSFORM,
    limits,
    screenLimits
})

export const selectEpoch = (t1, t2, name) => ({
    type: SELECT_EPOCH,
    t1,
    t2,
    name
})

export const unselectEpoch = (t1, t2, name) => ({
    type: UNSELECT_EPOCH
})

export const requestData = () => ({
    type: REQUEST_DATA
})

export const receiveData = (data) => ({
    type: RECEIVE_DATA,
    data
})

export const dragScreen = (dx, dy) => ({
    type: DRAG_SCREEN,
    dx,
    dy
})

export const dragTimeline = (dx, dy, id) => ({
    type: DRAG_TIMELINE,
    dx,
    dy,
    id
})

export const fetchData = () => dispatch => {
    dispatch(requestData())

    let urls = ['/ru_moscow.tsv', '/ru_tsarstvo.tsv']
    Promise.all(urls.map(url => fetch(url)))
    .then(results => Promise.all(results.map(res => res.text())))
    .then(texts => dispatch(receiveData(texts.map(text => d3.tsvParse(text))))) 
}    
