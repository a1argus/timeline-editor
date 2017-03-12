import React, { Component, PropTypes } from 'react'
import { NativeTypes } from 'react-dnd-html5-backend'
import { DropTarget } from 'react-dnd'

import './OpenDropFileButton.css'

const fileTarget = {
	drop(props, monitor) {
		props.onOpen.bind(null, monitor.getItem().files[0])()
	}
}

const collect = (connect, monitor) => {
	return {
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver(),
		canDrop: monitor.canDrop()
	}
}

class OpenDropFileButton extends Component {
	static propTypes = {
		onOpen: PropTypes.func.isRequired,
	}
	
	onChange(e) {
		let { onOpen } = this.props
		onOpen(e.target.files[0])
	}
	
	render() {
		let { connectDropTarget, isOver, canDrop } = this.props
		return connectDropTarget(
			<div
				className='open-drop-file-button'
				style={{backgroundColor: (isOver && canDrop) ?  '#efe' : 'white'}}
			>
				<label>
					<div>Open/Drop</div>
					<input
						type='file'
						onChange={this.onChange.bind(this)}
						onClick={(event)=> { event.target.value = null }}
					/>
				</label>
			</div>
		)
	}
}


export default DropTarget(
	NativeTypes.FILE,
	fileTarget,
	collect
)(OpenDropFileButton)
