pvis.campaign = {}
pvis.campaign.timestamp = function(v) {
	return new Date(v.data.responses[0].value)
}

pvis.campaign.skipped = "SKIPPED"
pvis.campaign.not_displayed = "NOT_DISPLAYED"

pvis.campaign.showPrompt = function(value) {
	return value != pvis.campaign.skipped && value != pvis.campaign.not_displayed;
}