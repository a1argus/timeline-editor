import React, { Component, PropTypes } from 'react'

class FileList extends Component {
	static propTypes = {
		files: PropTypes.array.isRequired,
	}

	render() {
		return (
			<div
				className='drop-files__file-list'
			>
				<ul>
					{
						this.props.files.map((file, i) => (
							<li key={i}>
								{file}
							</li>
						))
					}
				</ul>
			</div>	
		)
	}
}

export default FileList