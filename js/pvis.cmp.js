console.log('cmp')

pvis.timestamp = function(v) {
	return new Date(v.metadata.timestamp);
}

pvis.compare = function(r,k) {
	return utils.compareDates(this.resTime(r), this.keyTime(k), this.duration, this.offset);
}

pvis.calculate = function() {	
	var self = this;
	
	if(!pvis.controller.data[this.from.payload_id] || !pvis.controller.data[self.to]) {
		return;
	}
	
	var data;
	
	$.each(pvis.controller.data[self.from.payload_id], function(i,v) {
		// Search instances of this key
		if(self.filter(v)) {
			$.each(pvis.controller.data[self.to], function(i2,v2) {
				var res = self.compare(v2,v,self.duration,self.offset);
				if(res < 0) {
					return false;
				} else if(res == 0) {
					data = {
						'key':{
							'timestamp':self.keyTime(v),
							'value':self.keyValue(v)
						},
						'res':{
							'timestamp':self.resTime(v2),
							'value':self.resValue(v2)
						}
					}
					return false;
				}
			});
		}
			
		if(data) {
			return false;
		}
	});

	return data;
}

var pam = {}
pam.positive = ["excited", "delighted", "happy", "glad", "calm", "satisfied", "serene", "sleepy"]
pam.negative = ["afraid", "tense", "frustrated", "angry", "miserable", "sad", "gloomy", "tired"]

pvis.cmp = [
	{
		"from": pvis.pam,
		"to": "notes",
		"key": pam.positive,
		"duration": 3600000,
		"offset": 0.5,
		
		"filter": pvis.pam.filter,
		"keyTime": pvis.timestamp,
		"keyValue": pvis.pam.value,
		"resTime": pvis.campaign.timestamp,
		"resValue": pvis.notes.value,
		"compare": pvis.compare,
		"calculate": pvis.calculate,
		"visualize": pvis.notes.visualize
	},
	{
		"from": pvis.pam,
		"to": "notes",
		"key": pam.negative,
		"duration": 3600000,
		"offset": 0.5,
		
		"filter": pvis.pam.filter,
		"keyTime": pvis.timestamp,
		"keyValue": pvis.pam.value,
		"resTime": pvis.campaign.timestamp,
		"resValue": pvis.notes.value,
		"compare": pvis.compare,
		"calculate": pvis.calculate,
		"visualize": pvis.notes.visualize
	},
	{
		"from": pvis.pam,
		"to": "runkeeper",
		"key": pam.positive,
		"duration": 10800000,
		"offset": 0.9,
		
		"filter": pvis.pam.filter,
		"keyTime": pvis.timestamp,
		"keyValue": pvis.pam.value,
		"resTime": pvis.timestamp,
		"resValue": pvis.runkeeper.value,
		"compare": pvis.runkeeper.compare,
		"calculate": pvis.calculate,
		"visualize": pvis.runkeeper.visualize
	},
	{
		"from": pvis.pam,
		"to": "food",
		"key": ["tired","sleepy"],
		"duration": 3600000,
		"offset": 0.9,
		
		"filter": pvis.pam.filter,
		"keyTime": pvis.timestamp,
		"keyValue": pvis.pam.value,
		"resTime": pvis.campaign.timestamp,
		"resValue": pvis.food.value,
		"compare": pvis.compare,
		"calculate": pvis.calculate,
		"visualize": pvis.food.visualize
	},
	{
		"from": pvis.pam,
		"to": "sleep",
		"key": ["tired"],
		"duration": 64800000,
		"offset": 0.9,
		
		"filter": pvis.pam.filter,
		"keyTime": pvis.timestamp,
		"keyValue": pvis.pam.value,
		"resTime": pvis.timestamp,
		"resValue": pvis.sleep.value,
		"compare": pvis.compare,
		"calculate": pvis.calculate,
		"visualize": pvis.sleep.visualize
	},
	{
		"from": pvis.pam,
		"to": "weight",
		"key": ["tired"],
		"duration": 64800000,
		"offset": 0.1,
		
		"filter": pvis.pam.filter,
		"keyTime": pvis.timestamp,
		"keyValue": pvis.pam.value,
		"resTime": pvis.timestamp,
		"resValue": pvis.weight.value,
		"compare": pvis.compare,
		"calculate": pvis.calculate,
		"visualize": pvis.notes.visualize
	},
	{
		"from": pvis.pam,
		"to": "glucose",
		"key": ["tired","sleepy","gloomy"],
		"duration": 3600000,
		"offset": 0.9,
		
		"filter": pvis.pam.filter,
		"keyTime": pvis.timestamp,
		"keyValue": pvis.pam.value,
		"resTime": pvis.timestamp,
		"resValue": pvis.glucose.value,
		"compare": pvis.compare,
		"calculate": pvis.calculate,
		"visualize": pvis.glucose.visualize
	},
	{
		"from": pvis.glucose,
		"to": "food",
		"key": ">= 150",
		"duration": 7200000,
		"offset": 0.9,
		
		"filter": pvis.glucose.filter,
		"keyTime": pvis.timestamp,
		"keyValue": pvis.glucose.value,
		"resTime": pvis.campaign.timestamp,
		"resValue": pvis.food.value,
		"compare": pvis.compare,
		"calculate": pvis.calculate,
		"visualize": pvis.food.visualize
	}

]
