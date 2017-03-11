import * as d3 from 'd3'
import moment from 'moment'

// limits

export const limitsToTransform1D = (limits, screenLimits) => {
	let ys1 = screenLimits[0]
	let ys2 = screenLimits[1]
	let y1 = limits[0]
	let y2 = limits[1]
	return {
		translate: -(ys2 * y1 - ys1 * y2) / (ys2 - ys1),
		scale: (ys2 - ys1) / (y2 - y1)
	}
}

export const transform1DToLimits = (transform, screenLimits) => {
	let ys1 = screenLimits[0]
	let ys2 = screenLimits[1]
	let ty = transform.translate
	let tk = transform.scale
	return [
		(ys1 / tk) - ty,
		(ys2 / tk) - ty
	]
}


// transform1D

export const transformToTransform1D = (transform) => {
	return { translate: transform.translateY, scale: transform.scaleY }
}

export const transform1DToScale = (transform1D, screenLimits) => {
	let [ limit1, limit2 ] = transform1DToLimits(transform1D, screenLimits)
	//console.log(moment(limit1, 'Y').format('DD-MM-YYYY'))
	return d3.scaleTime()
	.domain([moment(limit1, 'Y'), moment(limit2, 'Y')])
	.range(screenLimits)
}


// d3Transform

export const d3Transform = (transform) => {
	let g = document.createElementNS("http://www.w3.org/2000/svg", "g")
	g.setAttributeNS(null, "transform", transform);
	let matrix = g.transform.baseVal.consolidate().matrix;
	let {a, b, c, d, e, f} =matrix
	let scaleX = Math.sqrt(a * a + b * b)
	if(scaleX) { a /= scaleX; b /= scaleX; }
	let skewX = a * c + b * d
	if(skewX) { c -= a * skewX; d -= b * skewX; }
	let scaleY = Math.sqrt(c * c + d * d)
	if(scaleY) { c /= scaleY; d /= scaleY; skewX /= scaleY; }
	if(a * d < b * c) { a = -a; b = -b; skewX = -skewX; scaleX = -scaleX; }
	return {
		translateX: e,
		translateY: f,
		rotate: Math.atan2(b, a) * Math.PI/180,
		skewX: Math.atan(skewX) * Math.PI/180,
		scaleX,
		scaleY
	}
}



// zoomByCenter

export const zoomByCenter = (translateY, scaleY, newScaleY, screenCenter) => {
	return {
		translate: translateY + screenCenter * ((1 / newScaleY) - (1 / scaleY)),
		scale: newScaleY
	}
}

