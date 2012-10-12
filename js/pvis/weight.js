pvis.weight = {}
pvis.weight.payload_id = "weight"

pvis.weight.value = function(v) {
	return v.data.weight;
}

pvis.weight.timestamp = pvis.timestamp;

pvis.weight.visualize = pvis.visualize;