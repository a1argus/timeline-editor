import fetch from 'isomorphic-fetch'
import * as d3 from 'd3'

export const
    REQUEST_DATA = 'REQUEST_DATA',
    RECEIVE_DATA = 'RECEIVE_DATA',
    CHANGE_TRANSFORM = 'CHANGE_TRANSFORM',
    DRAG_SCREEN = 'DRAG_SCREEN',
    DRAG_TIMELINE = 'DRAG_TIMELINE',
    SELECT_EPOCH = 'SELECT_EPOCH',
    UNSELECT_EPOCH = 'UNSELECT_EPOCH',
    REQUEST_FILE = 'REQUEST_FILE',
    RECEIVE_FILE = 'RECEIVE_FILE',
    CLEAR_FILE = 'CLEAR_FILE',
    CLEAR_ALL = 'CLEAR_ALL',
    HIDE_FILE = 'HIDE_FILE',
    UNHIDE_FILE = 'UNHIDE_FILE',
    EXPORT_ALL = 'CLEAR_ALL'

export const exportAll = () => ({
    type: EXPORT_ALL
})

export const clearAll = () => ({
    type: CLEAR_ALL
})

export const hideFile = (fileName) => ({
    type: HIDE_FILE,
    fileName
})

export const unhideFile = (fileName) => ({
    type: UNHIDE_FILE,
    fileName
})

export const clearFile = (fileName) => ({
    type: CLEAR_FILE,
    fileName
})

export const requestFile = (fileName) => ({
    type: REQUEST_FILE,
    fileName
})

export const receiveFile = (timelines, fileName, format) => ({
    type: RECEIVE_FILE,
    timelines,
    fileName,
    format
})

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

export const fetchFile = (url, fileName) => dispatch => {
    dispatch(requestFile(fileName))
    fetch(url)
    .then(res => res.text())
    .then(text => dispatch(receiveFile([d3.tsvParse(text)], fileName, 'tsv')))
}

export const fetchData = () => dispatch => {
    dispatch(requestData())

    let urls = ['/ru_moscow.tsv', '/ru_tsarstvo.tsv']
    Promise.all(urls.map(url => fetch(url)))
    .then(results => Promise.all(results.map(res => res.text())))
    .then(texts => dispatch(receiveData(texts.map(text => d3.tsvParse(text))))) 
}

export const loadFile = (file) => dispatch => {
    dispatch(requestFile(file.name))
    let reader = new FileReader()
    reader.onload = e => {
        if(file.name.endsWith('.tsv')) {
            dispatch(receiveFile([d3.tsvParse(e.target.result)], file.name, 'tsv'))
        }
    }
    reader.readAsText(file, 'cp1251')
}
