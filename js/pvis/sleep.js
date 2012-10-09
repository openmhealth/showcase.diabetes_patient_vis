pvis.sleep = {}
pvis.sleep.value = function(v) {
	return {
		'timestamp': new Date(v.metadata.timestamp),
		'efficiency': v.data.efficiency,
		'totalLying': v.data.totalLying,
		'totalSleep': v.data.totalSleep
	};
}

pvis.sleep.visualize = function(g, d, data, scale) {

  var note = g.append("g")
      .attr("text-anchor", "right")
      .attr("transform", "translate(0,170)");

  var text = note.append("text")

	text.append("tspan")
			.text("Lying Down: " + utils.toClock(data.res.value.totalLying));

	text.append("tspan")
			.attr("x",0)
			.attr("dy", "1em")
			.text("Sleeping: " + utils.toClock(data.res.value.totalSleep));
						
	text.append("tspan")
			.attr("x",0)
			.attr("dy", "1em")
			.text("Sleep Efficiency: " + data.res.value.efficiency + "%");
}
