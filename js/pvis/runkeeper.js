pvis.runkeeper = {}
pvis.runkeeper.value = function(v) {
	return {
		'duration': v.data.duration,
		'start': new Date(v.data.start_time),
		'type': v.data.type
	};
}

pvis.runkeeper.compare = function(r,k) {
	console.log("r=")
	console.log(r.metadata.timestamp)
	console.log("k=")
	console.log(k.metadata.timestamp)
	return utils.compareDates(this.resTime(r), this.keyTime(k), this.duration, this.offset);
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