pvis.food = {}
pvis.food.value = function(v) {
	return {
		'carbCount': v.data.responses[1].value,
		'carbNote': v.data.responses[2].value,
		'fatCount': v.data.responses[3].value,
		'fatNote': v.data.responses[4].value,
		'proteinCount': v.data.responses[5].value,
		'proteinNote': v.data.responses[6].value,
		'mealPhoto': v.data.responses[7].value,
		'fullness': v.data.responses[8].value,
		'homemade': v.data.responses[9].value,
		'nonHomeMadeMealContent': v.data.responses[10].value
	};
}

pvis.food.visualize = function(g, d, data, scale) {
  var note = g.append("g")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(0,190)");

  note.append("text")
			.attr("dx", scale(data.res.timestamp))
      .text(data.res.value.carbNote)
}