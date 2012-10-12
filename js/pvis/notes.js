pvis.notes = {}
pvis.notes.payload_id = "notes";

pvis.notes.value = function(v) {
	return v.data.responses[1].value;
}

pvis.notes.visualize = function(g, d, data, scale) {

	var b = new bubble(g, scale(data.res.timestamp));
	b.addText([data.res.value]);
}