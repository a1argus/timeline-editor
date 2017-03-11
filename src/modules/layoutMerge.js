/**
 * 1-dimensional layout of elements with equal sizes
 * input positions are arbitrary
 * output positions comply with size of elements
 * and minimize sum of offset from input positions
 * data - input array of elements
 * field - name of field with position information, used for output positions also
 * h - size of each element
 */
const layoutMerge = (data, field, h, xMin = -Infinity, xMax = Infinity) => {

	// create output array with initial positions
	let outs = []
	for(let i = 0; i < data.length; i++) {
		if(field in data[i] && data[i][field] !== null ) {
			outs.push({x: data[i][field], i: i})
		}
	}

	// create initial groups of 1 element
	let groups = []
	for(let i = 0; i < outs.length; i++) {
		groups.push(createGroup(i, i))
	}

	// merge groups while there are any intersections
	while (mergeGroups()) {	}

	// arrange elements in groups equidistantly
	for(let j = 0; j < groups.length; j++) {
		for(let n = 0; n <= groups[j].i2 - groups[j].i1; n++) {
			outs[parseInt(groups[j].i1, 10) + parseInt(n, 10)].x = groups[j].x1 + h * n
		}
	}

	// save calculated coords in output array
	for(let i = 0; i < outs.length; i++) {
		data[outs[i].i][field] = outs[i].x
	}

	return data

	// create group from elements with numbers i1 to i2
	function createGroup(i1, i2) {
		// number of elements
		let n = i2 - i1 + 1
		// edges of group centered around center of mass of base points
		let x1 = (outs[i1].x + outs[i2].x) / 2 - h * n / 2
		let x2 = x1 + h * n

		// check external limits
		if (x1 < xMin) {
			// apply limit only if it does not contradict other limit
			if (xMin + h * n < xMax) {
				x1 = xMin
				x2 = xMin + h * n
			}
		}
		if (x2 > xMax) {
			if (xMax - h * n > xMin) {
				x1 = xMax - h * n
				x2 = xMax
			}
		}

		return {i1, i2, x1, x2}
	}

	// merge intersecting groups
	function mergeGroups() {
		let merged = false
		let newGroups = []
		let j = 0
		// one time go through all groups
		while (j < groups.length) {
			// number of groups in current merge
			var n = 1
			// while any groups for merge && current merge intersecting next group
			while(
				j + n < groups.length &&
				groups[j].x2 >= groups[j + n].x1
			) {
				n++	
			}
			// if any merge happened
			if (n > 1) { merged = true }
			// save new merge
			newGroups.push(createGroup(groups[j].i1, groups[j + n - 1].i2))
			// jump to the end of new merge and continue for other merges
			j += n
		}
		// update groups array
		groups = newGroups
		return merged
	}
}

export default layoutMerge