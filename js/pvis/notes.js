pvis.notes = {}
pvis.notes.value = function(v) {
	return v.data.responses[1].value;
}

pvis.notes.visualize = function(g, d, data, scale) {
  var note = g.append("g")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(0,190)");

  note.append("text")
			.attr("dx", scale(data.res.timestamp))
      .text(data.res.value)
}