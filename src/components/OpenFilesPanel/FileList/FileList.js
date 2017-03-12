import React, { Component, PropTypes } from 'react'
import _ from 'lodash'

import Button from '../../../components-lib/Button/Button'

class FileList extends Component {
	static propTypes = {
		files: PropTypes.object.isRequired,
		onClearFile: PropTypes.func.isRequired,
		onToggleHideFile: PropTypes.func.isRequired,
	}

	render() {
		let { files, onClearFile, onToggleHideFile } = this.props
		return (
			<div
				className='drop-files__file-list'
			>
				{
					_.sortBy(_.values(files), 'id', 'desc').map(file => (
						<div
							key={file.id}
						>
							{file.isLoading ? 'Loading... ' : ''}{file.name}
							<Button text={file.hidden ? 'Unhide' : 'Hide'} onClick={onToggleHideFile.bind(null, file.name, file.hidden)}/>
							<Button text='Clear' onClick={onClearFile.bind(null, file.name)}/>
						</div>
					))
				}
			</div>
		)
	}
}

export default FileList