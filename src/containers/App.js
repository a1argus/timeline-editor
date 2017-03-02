import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'


import {
    fetchData,
    changeZoom,
    dragScreen,
    dragTimeline
} from '../actions'
import Screen from '../components/Screen/Screen'
import Zoom from '../components/Zoom/Zoom'
import { zoomToYears } from '../modules/utils'
import './App.css'

const zoomByCenter = (translateY, scaleY, newScaleY, screenCenter) => {
    return {
        translateY: translateY + screenCenter * ((1 / newScaleY) - (1 / scaleY)),
        scaleY: newScaleY
    }
}

class App extends Component {
    static propTypes = {
        items: PropTypes.array.isRequired,
    }

    onChangeZoom(e, zoom) {
        let { translateY, scaleY } = zoomByCenter(
            zoom.translateY,
            zoom.scaleY,
            parseInt(e.target.value, 10),
            1000/2
        )
        this.props.dispatch(changeZoom(zoomToYears({...zoom, translateY, scaleY})))
    }

    onDragScreen(e) {
        this.props.dispatch(dragScreen(e.dx, e.dy))
    }

    onDragTimeline(e, id) {
        this.props.dispatch(dragTimeline(e.dx, e.dy, id))
    }
    
    componentDidMount() {
        this.props.dispatch(fetchData())
        setTimeout(() => this.props.dispatch(changeZoom({year1: 1100, year2: 1800})), 2000)
    }

    
    render() {
        const { items, zoom, animation } = this.props

        return (
            <div className='app'>
                <Screen
                    items={items}
                    zoom={zoom}
                    onDragScreen={this.onDragScreen.bind(this)}
                    onDragTimeline={this.onDragTimeline.bind(this)}
                    animation={animation}
                />
                <Zoom
                    zoom={zoom}
                    onChangeZoom={this.onChangeZoom.bind(this)}
                />
            </div>
        )
    }
}

const mapStateToProps = state => {
  const { items, zoom, animation } = state
  return {
      items,
      zoom,
      animation
  }
}

export default connect(mapStateToProps)(App)
