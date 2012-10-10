pvis.glucose = {}
pvis.glucose.value = function(v) {
	return v.data;
}

pvis.glucose.visualize = function(g, d, data, scale) {

	var b = new bubble(g, scale(data.res.timestamp));
	b.addText([
		"Glucose: " + data.res.value.glucose,
		"Event: " + data.res.value.testevent
		]);
}