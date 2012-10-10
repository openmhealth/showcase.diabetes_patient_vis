pvis.glucose = {}
pvis.glucose.payload_id = "glucose";

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

pvis.glucose.filter = function(v) {
	return eval(this.keyValue(v).glucose + this.key)
}

pvis.glucose.key_title = function(key) {
	return key;
}