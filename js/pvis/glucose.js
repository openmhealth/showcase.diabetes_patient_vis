pvis.glucose = {}
pvis.glucose.value = function(v) {
	return v.data.glucose;
}

pvis.glucose.visualize = function(g, d, data, scale) {
	
	console.log(data)
	
	// Add the note
  var note = g.append("g")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(0,190)");

  note.append("text")
			.attr("dx", scale(data.res.timestamp))
      .text(data.res.value)
}