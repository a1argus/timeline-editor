import fetch from 'isomorphic-fetch'
import * as d3 from 'd3'

export const
    REQUEST_DATA = 'REQUEST_DATA',
    RECEIVE_DATA = 'RECEIVE_DATA',
    CHANGE_ZOOM = 'CHANGE_ZOOM',
    DRAG_SCREEN = 'DRAG_SCREEN',
    DRAG_TIMELINE = 'DRAG_TIMELINE'

export const changeZoom = (years) => ({
    type: CHANGE_ZOOM,
    years
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
    return fetch(`/ru_moscow.tsv`)
    .then(res => res.text())
    .then(tsv => dispatch(receiveData(d3.tsvParse(tsv))))
}    
