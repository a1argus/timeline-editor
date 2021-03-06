import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import _ from 'lodash'

import {
    changeTransform,
    dragScreen,
    dragTimeline,
    selectEpoch,
    unselectEpoch,
    loadFile,
    fetchFile,
    clearFile,
    exportAll,
    hideFile,
    clearAll,
    unhideFile
} from '../actions'
import Screen from '../components/Screen/Screen'
import ZoomKnob from '../components/ZoomKnob/ZoomKnob'
import Scale from '../components/Scale/Scale'
import OpenFilesPanel from '../components/OpenFilesPanel/OpenFilesPanel'
import TimelineEditorPanel from '../components/TimelineEditorPanel/TimelineEditorPanel'
import { transform1DToLimits, zoomByCenter } from '../modules/transforms'
import './App.css'

class App extends Component {
    static propTypes = {
        data: PropTypes.object.isRequired,
    }
    
    onClearAll() {
        this.props.dispatch(clearAll())
    }
    
    onClearFile(fileName) {
        this.props.dispatch(clearFile(fileName))
    }

    onExportAll() {
        this.props.dispatch(exportAll())
    }

    onToggleHideFile(fileName, fileHidden) {
        if(fileHidden) { this.props.dispatch(unhideFile(fileName)) }
        else { this.props.dispatch(hideFile(fileName)) }
    }

    onOpenFile(file) {
        this.props.dispatch(loadFile(file))
    }

    onChangeZoom(value) {
        let { transform, screen } = this.props
        let { translate, scale } = zoomByCenter(
            transform.translateY,
            transform.scaleY,
            1 / (parseFloat(value) / screen.size.height),
            screen.size.height / 2
        )
        this.props.dispatch(changeTransform(transform1DToLimits({translate, scale}, [0, screen.size.height]), [0, screen.size.height]))
    }

    onDragScreen(e) {
        this.props.dispatch(dragScreen(e.dx, e.dy))
    }

    onDragTimeline(e, id) {
        this.props.dispatch(dragTimeline(e.dx, e.dy, id))
    }

    onDragScale(e) {
        this.props.dispatch(dragScreen(0, e.dy))
    }

    onMouseEnterEpoch(year1, year2, name) {
        this.props.dispatch(selectEpoch(year1, year2, name))
    }

    onMouseLeaveEpoch() {
        this.props.dispatch(unselectEpoch())
    }

    componentDidMount() {
        [
            '/ru_moscow.tsv',
            '/ru_tsarstvo.tsv'
        ]
        .forEach(url => {
            this.props.dispatch(fetchFile([url], url.split('/').slice(-1)[0]))
        })

    }

    
    render() {
        const { data, transform, animation, screen } = this.props
        let timelines = _.omitBy(data.timelines, d => d.hidden)
        return (
            <div className='app'>
                <Screen
                    timelines={timelines}
                    size={screen.size}
                    transform={transform}
                    onDragScreen={this.onDragScreen.bind(this)}
                    onDragTimeline={this.onDragTimeline.bind(this)}
                    onMouseEnterEpoch={this.onMouseEnterEpoch.bind(this)}
                    onMouseLeaveEpoch={this.onMouseLeaveEpoch.bind(this)}
                    animation={animation}
                />
                <ZoomKnob
                    value={screen.size.height / transform.scaleY}
                    size={{width: 60, height: 400}}
                    visorSizes={{width: 40, height: 30}}
                    range={[100, 2000]}
                    step={100}
                    onChangeZoom={this.onChangeZoom.bind(this)}
                />
                <Scale
                    transform={transform}
                    onDragScale={this.onDragScale.bind(this)}
                    animation={animation}
                />
                <OpenFilesPanel
                    files={data.files}
                    message='Загрузить файлы'
                    onClearAll={this.onClearAll.bind(this)}
                    timelines={timelines}
                    onOpen={this.onOpenFile.bind(this)}
                    onClearFile={this.onClearFile.bind(this)}
                    onToggleHideFile={this.onToggleHideFile.bind(this)}
                />
                <TimelineEditorPanel
                    message='Timeline'
                />
            </div>
        )
    }
}

const mapStateToProps = state => {
  const { data, transform, animation, screen } = state
  return {
      data,
      transform,
      animation,
      screen
  }
}

export default DragDropContext(HTML5Backend)(connect(mapStateToProps)(App))
