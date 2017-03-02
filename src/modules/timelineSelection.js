import d3 from 'd3'
import moment from 'moment/src/moment'

const timelineSelection = () => {

	var x = 0,
		t1 = 0,
		t2 = 0,
		scale = d3.scaleLinear(),
		base = null,
		class_,
		visible = false;

	function timelineSelection(base_) {

		base = base_;

		var selectionG = base
		.append("g")
		.attr("class", class_)
		.attr("transform", "translate(" + 0 + "," + 0 + ")")
		.classed("hidden", !visible);

		selectionG
		.append("rect")
		.attr("x", x)
		.attr("y", 0)
		.attr("width", 10)
		.attr("height", 0)
		.style("fill", "red")
		.style("opacity", .3);

		selectionG
		.append("text")
		.attr("class", "label1")
		.attr("x", x + 12)
		.attr("y", scale(t1))
		.style("fill", "red")
		.style("text-anchor", "start");

		selectionG
		.append("text")
		.attr("class", "label2")
		.attr("x", x + 12)
		.attr("y", scale(t1))
		.attr("dy", ".8em")
		.style("fill", "red")
		.style("text-anchor", "start");

	};

	timelineSelection.redraw = function() {

		var h = scale(t2) - scale(t1);

		var selectionG = base.select("." + class_);

		selectionG
		.attr("transform", "translate(" + 0 + "," + parseInt(scale(t1)) + ")")
		.classed("hidden", !visible);

		selectionG.select("rect")
		.attr("height", (h == 0) ? 1 : h);

		var trimNil = function(d) {
			return d.slice(0, 1) == "0" ? d.slice(1) : d;
		};

		selectionG.select(".label1")
		.text(parseInt(trimNil(moment(t1).format('YYYY'))))
		.attr("y", 0);

		selectionG.select(".label2")
		.text(parseInt(trimNil(moment(t2).format('YYYY'))))
		.attr("y", h);
	};

	timelineSelection.visible = function (_) {
		if (!arguments.length) return visible;
		visible = _;
		return this;
	};

	timelineSelection.t1 = function (_) {
		if (!arguments.length) return t1;
		t1 = _;
		return this;
	};

	timelineSelection.t2 = function (_) {
		if (!arguments.length) return t2;
		t2 = _;
		return this;
	};


	timelineSelection.scale = function (_) {
		if (!arguments.length) return scale;
		scale = _;
		return this;
	};

	timelineSelection.class = function (_) {
		if (!arguments.length) return class_;
		class_ = _;
		return this;
	};

	timelineSelection.x = function (_) {
		if (!arguments.length) return x;
		x = _;
		return this;
	};


	return timelineSelection;
}

export default timelineSelection