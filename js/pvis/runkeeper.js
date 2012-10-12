pvis.runkeeper = {}
pvis.runkeeper.payload_id = "runkeeper";

pvis.runkeeper.value = function(v) {
	return {
		'duration': v.data.duration,
		'start': new Date(v.data.start_time),
		'type': v.data.type
	};
}

pvis.runkeeper.compare = function(r,k) {
	var begin = utils.compareDates(r.data.start_time, this.from.timestamp(k), this.duration, this.offset);
	var end = utils.compareDates(new Date(r.data.start_time).getTime() + r.data.duration, this.from.timestamp(k), this.duration, this.offset);
	
	if(begin == 0 || end == 0) {
		return 0;
	}
	
	return begin + end;
}

pvis.runkeeper.visualize = function(g, d, data, scale) {
	var x1 = d3.time.scale()
    .domain([0, d.duration])
    .range([0, width]);

	// Update the measure rects.
	var measure = g.selectAll("rect.measure")
    .data([data.res.value]);
        
	var runkeeperbar = measure.enter();
				
	runkeeperbar.append("svg:rect")
    .attr("class", function(d, i) { return "measure s" + i; })
    .attr("width", function(d) { return x1(d.duration*1000); })
    .attr("height", height / 3)
    .attr("x", function(d) { return scale(d.start)})
    .attr("y", height/2);
	
	runkeeperbar.append("svg:text")
    .attr("class", "title")
    .attr("x", function(d) { return scale(d.start.getTime()) + 5})
    .attr("y", 2 * height / 3)
		.text(function(d) { return d.type; })
}