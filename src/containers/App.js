import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'


import {
    fetchData
} from '../actions'
import './App.css'


class App extends Component {
    static propTypes = {
        items: PropTypes.array.isRequired,
    }

    
    componentDidMount() {
        this.props.dispatch(fetchData())
    }

    
    render() {
        const { items } = this.props

        return (
            <div className='app'>
                <div className='site-container'>

                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
  const { items } = state
  return {
      items
  }
}

export default connect(mapStateToProps)(App)
