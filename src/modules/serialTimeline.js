import d3 from 'd3'
import layoutMerge from './layoutMerge.js'


const serialTimeline = () => {

	var t1 = (d) =>  d.t1,
		t2 = (d) =>  d.t2,
		data = [],
		h0 = 10,
		h1 = 15,
		title = "",
		scale = d3.scaleLinear,
		x = 100,
		limit1 = -Infinity,
		limit2 = Infinity,
		class_ = 'timeline',
		base = null,
		listeners = d3.dispatch("selected", "unselected");

	var wMain = 200;
		wOuterSpacing = 50,
		wTitle = 20,
		xTitleTextOffset = 5,
		yTitleTextOffset = 5,
		xHiddenTitleTextOffset = 10;

	function serialTimeline(base_) {

		initData(data);

		data = layoutMerge(data, "y0", h0, limit1 + parseInt(data[0].y), limit2 + parseInt(data.slice(-1)[0].y) + parseInt(data.slice(-1)[0].h));

		var yTitle = 0;
		if (data.length) {
			yTitle = parseInt(data[0].y);
		}

		base = base_;

		var timelineG = base
		.append("g")
		.attr("class", class_)
		.attr("transform", "translate(" + parseInt(x) + "," + 0 + ")");

		var epochG = timelineG
		.selectAll("epoch")
		.data(data)
		.enter()
		.append("g")
		.attr("class", "epoch")
		.attr('transform', function (d, i) {
			return 'translate(' + parseInt(wTitle) + ', ' + d.y + ')';
		})
		.classed("last", function (d, i) {
			return i == data.length - 1;
		});

		epochG
		.append("rect")
		.attr("rx", 3)
		.attr("ry", 3)
		.attr("class", function (d, i) {
			switch (d.type) {
				case 0:
					return "type0";
				case 1:
					return "type1";
				default:
					return "type2";
			}
		})
		.attr("height", function (d, i) {
			return (d.h >= 0) ? d.h : 0;
		})
		.attr("width", wMain)
		.on("mouseenter", onMouseEnterSelection)
		.on("mouseleave", onMouseLeaveSelection);

		epochG
		.filter(function (d) {
			return d.type == 0;
		})
		.append("rect")
		.attr("class", "type0")
		.attr("x", wMain + wOuterSpacing)
		.attr("y", function (d, i) {
			return d.y0 - d.y;
		})
		.attr("width", 0)
		.attr("height", h0)
		.classed("back", true);

		epochG
		.append("text")
		.text(function (d, i) {
			return d.name;
		})
		.attr("class", function (d, i) {
			switch (d.type) {
				case 0:
					return "type0";
				case 1:
					return "type1";
				default:
					return "type2";
			}
		})
		.attr("x", function (d, i) {
			switch (d.type) {
				case 0:
					return wMain + wOuterSpacing;
				case 1:
					return wMain / 2;
				default:
					return wMain / 2;
			}
		})
		.attr("y", function (d, i) {
			switch (d.type) {
				case 0:
					return d.y0 - d.y + h0 / 2;
				case 1:
					return d.h / 2;
				default:
					return d.h / 2;
			}
		})
		.attr("dy", function (d, i) {
			switch (d.type) {
				case 0:
					return "0.32em";
				case 1:
					return "0.32em";
				default:
					return "0.32em";
			}
		})
		.on("mouseenter", onMouseEnterSelection)
		.on("mouseleave", onMouseLeaveSelection);

		epochG
		.filter(function (d) {
			return d.type == 0;
		})
		.select("rect.back")
		.attr("width", function (d, i) {
			return d3.select(this.parentNode).select("text").node().getBBox().width;
		});

		epochG
		.filter(function (d) {
			return d.type == 0;
		})
		.append("line")
		.attr("class", "type0")
		.attr("x1", wMain)
		.attr("y1", function (d) {
			return d.h / 2;
		})
		.attr("x2", wMain + wOuterSpacing)
		.attr("y2", function (d) {
			return d.y0 - d.y + h0 / 2;
		});


		var titleG = timelineG
		.append("g")
		.attr("class", "title")
		.attr('transform', function (d, i) {
			return 'translate(' + 0 + ', ' + parseInt(yTitle) + ')';
		});

		titleG
		.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", wTitle + wMain)
		.attr("y2", 0);

		titleG
		.append("text")
		.text(title)
		.attr("text-anchor", "end")
		.attr('transform', function (d, i) {
			return 'translate(' + parseInt(wTitle - 5) + ', ' + 5 + ') rotate(-90)';
		});

		var wTitleText = titleG.select("text").node().getBBox().width;
		var hTitleText = titleG.select("text").node().getBBox().height;

		if (parseInt(data.slice(-1)[0].y) + parseInt(data.slice(-1)[0].h) - parseInt(data[0].y) < wTitleText) {
			titleG.select("text")
			.text("*")
			.attr("dy", ".25em")
			.on("mouseover", function (d) {
				titleG.selectAll(".titleHidden")
				.classed("hidden", false);
				this.parentNode.parentNode.appendChild(this.parentNode);
			})
			.on("mouseout", function (d) {
				titleG.selectAll(".titleHidden")
				.classed("hidden", true);
			});

			titleG
			.append("rect")
			.attr("x", wTitle - hTitleText)
			.attr("y", xTitleTextOffset + xHiddenTitleTextOffset)
			.attr("height", wTitleText)
			.attr("width", hTitleText)
			.attr("class", "titleHidden")
			.classed("hidden", true);

			titleG
			.append("text")
			.text(title)
			.attr("class", "titleHidden")
			.attr("text-anchor", "end")
			.attr('transform', function (d, i) {
				return 'translate(' + parseInt(wTitle - xTitleTextOffset) + ', ' + parseInt(xTitleTextOffset + xHiddenTitleTextOffset) + ') rotate(-90)';
			})
			.classed("hidden", true);
		}

		return serialTimeline;
	}


	function onMouseEnterSelection(d, i) {
		d3.select(this.parentNode)
		.classed("selected", true);

		listeners.call("selected", {}, {t1: t1(d), t2: t2(d)});
	}

	function onMouseLeaveSelection(d, i) {
		d3.select(this.parentNode)
		.classed("selected", false);

		listeners.call("unselected");
	}


	function initData(data) {
		data.forEach(function (d) {
			d.h = scale(t2(d)) - scale(t1(d));
			d.y = parseInt(scale(t1(d)));

			if (d.h < h0) {
				d.type = 0;
				d.y0 = parseInt(d.y) + parseInt(d.h) / 2;
			}
			else if (d.h < h1) {
				d.type = 1;
			}
			else {
				d.type = 2;
			}
		});
	}


	serialTimeline.on = function() {
		var value = listeners.on.apply(listeners, arguments);
		return value === listeners ? serialTimeline : value;
	};

	serialTimeline.class = function (_) {
		if (!arguments.length) return class_;
		class_ = _;
		return this;
	};

	serialTimeline.data = function (_) {
		if (!arguments.length) return data;
		data = _;
		return this;
	};

	serialTimeline.t1 = function (_) {
		if (!arguments.length) return t1;
		t1 = _;
		return this;
	};

	serialTimeline.t2 = function (_) {
		if (!arguments.length) return t2;
		t2 = _;
		return this;
	};


	serialTimeline.scale = function (_) {
		if (!arguments.length) return scale;
		scale = _;
		return this;
	}

	serialTimeline.x = function (_) {
		if (!arguments.length) return x;
		x = _;
		return this;
	}

	serialTimeline.title = function (_) {
		if (!arguments.length) return title;
		title = _;
		return this;
	}

	serialTimeline.h0 = function (_) {
		if (!arguments.length) return h0;
		h0 = _;
		return this;
	}

	serialTimeline.h1 = function (_) {
		if (!arguments.length) return h1;
		h1 = _;
		return this;
	}

	serialTimeline.limit1 = function (_) {
		if (!arguments.length) return limit1;
		limit1 = _;
		return this;
	}

	serialTimeline.limit2 = function (_) {
		if (!arguments.length) return limit2;
		limit2 = _;
		return this;
	}

	return serialTimeline;
}

export default serialTimeline