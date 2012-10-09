pvis.campaign = {}
pvis.campaign.timestamp = function(v) {
	return new Date(v.data.responses[0].value)
}