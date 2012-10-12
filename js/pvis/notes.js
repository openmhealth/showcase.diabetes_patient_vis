pvis.notes = {}
pvis.notes.payload_id = "notes";

pvis.notes.value = function(v) {
	return v.data.responses[1].value;
}

pvis.notes.timestamp = pvis.campaign.timestamp;

pvis.notes.visualize = pvis.visualize;