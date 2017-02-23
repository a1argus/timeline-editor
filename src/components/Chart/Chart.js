import React, { PropTypes, Component } from 'react'


import './Chart.css'


export default class Chart extends Component {
    static propTypes = {
        items: PropTypes.array.isRequired,
    }

    render() {
        const { items } = this.props

        return (
            <div className='chart'>

            </div>
        )   
    }
}