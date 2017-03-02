 const layoutMerge = (data, field, h, xMin = -Infinity, xMax = Infinity) => {

	var outs = [];
	for(let i = 0; i < data.length; i++) {
			if (data[i][field]) {
				outs.push({x: data[i][field], i: i})
			}
	}

	var groups = [];
	for(let i = 0; i < outs.length; i++) {
		groups.push(createGroup(i, i))
	}

	while (mergeGroups()) {	 }

	 for(let j = 0; j < groups.length; j++) {
		for(let n = 0; n <= groups[j].i2 - groups[j].i1; n++) {
			outs[parseInt(groups[j].i1, 10) + parseInt(n, 10)].x = groups[j].x1 + h * n
		}
	}


	for(let i = 0; i < outs.length; i++) {
		data[outs[i].i][field] = outs[i].x
	}

	return data

	function createGroup(i1, i2) {

		let n = i2 - i1 + 1
		let x1 = (outs[i1].x + outs[i2].x) / 2 - h * n / 2
		let x2 = x1 + h * n

		if (x1 < xMin) {
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

	function mergeGroups() {

		let merged = false
		let newGroups = []
		let j = 0;
		while (j < groups.length) {
			var n = 1;
			while(
				j + n < groups.length &&
				groups[j].x2 >= groups[j + n].x1
			) {
				n++	
			}
			if (n > 1) { merged = true }
			newGroups.push(createGroup(groups[j].i1, groups[j + n - 1].i2))
			j += n
		}
		groups = newGroups
		return merged
	}
}

export default layoutMerge