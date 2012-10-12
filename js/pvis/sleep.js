pvis.sleep = {}
pvis.sleep.payload_id = "sleep"

pvis.sleep.value = function(v) {
	return {
		'timestamp': new Date(v.metadata.timestamp),
		'efficiency': v.data.efficiency,
		'totalLying': v.data.totalLying,
		'totalSleep': v.data.totalSleep
	};
}

pvis.sleep.timestamp = pvis.timestamp;

pvis.sleep.visualize = function(g, d, data, scale) {

	var b = new bubble(g, scale(data.res.timestamp));
	b.addText([
			"Lying Down: " + utils.toClock(data.res.value.totalLying),
			"Sleeping: " + utils.toClock(data.res.value.totalSleep),
			"Sleep Efficiency: " + data.res.value.efficiency + "%"
		]);
}
