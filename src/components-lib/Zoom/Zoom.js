import React, { PropTypes, Component } from 'react'
import './Zoom.css'



export default class Zoom extends Component {
    static propTypes = {
        zoom: PropTypes.object.isRequired,
        onChangeZoom: PropTypes.func.isRequired,
    }

    onChangeZoom(e) {
        this.props.onChangeZoom(e.target.value, this.props.zoom)
    }

    render() {
        const { zoom } = this.props
        return (
            <input
                className='zoom'
                type='range'
                min='1'
                max='10'
                step='1'
                defaultValue={zoom.scaleY}
                onChange={this.onChangeZoom.bind(this)}
            />    
        )   
    }
}