import c from './const'

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

export const debug = (verbosity, message) => {
	if(verbosity <= c.debugVerbosity) { console.log(message); }
}

export const yearsToZoom = (years) => {
	let ys1 = 0
	let ys2 = c.svgH
	let y1 = years.year1
	let y2 = years.year2
	return {
		translateY: -(ys2 * y1 - ys1 * y2) / (ys2 - ys1),
		scaleY: (ys2 - ys1) / (y2 - y1)
	}
}

export const zoomToYears = (zoom) => {
	let ys1 = 0
	let ys2 = c.svgH
	let ty = zoom.translateY
	let tk = zoom.scaleY
	return {
		year1: (ys1 / tk) - ty,
		year2: (ys2 / tk) - ty
	}
}