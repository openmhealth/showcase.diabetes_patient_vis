console.log('cmp')

pvis.default = {}
pvis.default.timestamp = function(v) {
	return new Date(v.metadata.timestamp);
}

pvis.default.compare = function(r,k) {
	return utils.compareDates(this.resTime(r), this.keyTime(k), this.duration, this.offset);
}

pvis.default.calculate = function() {	
	var self = this;
	
	if(!omh.data[this.from.payload_id] || !omh.data[self.to]) {
		return;
	}
	
	var data;
	
	$.each(omh.data[self.from.payload_id], function(i,v) {
		// Search instances of this key
		if(self.filter(v)) {
			$.each(omh.data[self.to], function(i2,v2) {
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
		"keyTime": pvis.default.timestamp,
		"keyValue": pvis.pam.value,
		"resTime": pvis.campaign.timestamp,
		"resValue": pvis.notes.value,
		"compare": pvis.default.compare,
		"calculate": pvis.default.calculate,
		"visualize": pvis.notes.visualize
	},
	{
		"from": pvis.pam,
		"to": "notes",
		"key": pam.negative,
		"duration": 3600000,
		"offset": 0.5,
		
		"filter": pvis.pam.filter,
		"keyTime": pvis.default.timestamp,
		"keyValue": pvis.pam.value,
		"resTime": pvis.campaign.timestamp,
		"resValue": pvis.notes.value,
		"compare": pvis.default.compare,
		"calculate": pvis.default.calculate,
		"visualize": pvis.notes.visualize
	},
	{
		"from": pvis.pam,
		"to": "runkeeper",
		"key": pam.positive,
		"duration": 10800000,
		"offset": 0.9,
		
		"filter": pvis.pam.filter,
		"keyTime": pvis.default.timestamp,
		"keyValue": pvis.pam.value,
		"resTime": pvis.default.timestamp,
		"resValue": pvis.runkeeper.value,
		"compare": pvis.runkeeper.compare,
		"calculate": pvis.default.calculate,
		"visualize": pvis.runkeeper.visualize
	},
	{
		"from": pvis.pam,
		"to": "food",
		"key": ["tired","sleepy"],
		"duration": 3600000,
		"offset": 0.9,
		
		"filter": pvis.pam.filter,
		"keyTime": pvis.default.timestamp,
		"keyValue": pvis.pam.value,
		"resTime": pvis.campaign.timestamp,
		"resValue": pvis.food.value,
		"compare": pvis.default.compare,
		"calculate": pvis.default.calculate,
		"visualize": pvis.food.visualize
	},
	{
		"from": pvis.pam,
		"to": "sleep",
		"key": ["tired"],
		"duration": 64800000,
		"offset": 0.9,
		
		"filter": pvis.pam.filter,
		"keyTime": pvis.default.timestamp,
		"keyValue": pvis.pam.value,
		"resTime": pvis.default.timestamp,
		"resValue": pvis.sleep.value,
		"compare": pvis.default.compare,
		"calculate": pvis.default.calculate,
		"visualize": pvis.sleep.visualize
	},
	{
		"from": pvis.pam,
		"to": "weight",
		"key": ["tired"],
		"duration": 64800000,
		"offset": 0.1,
		
		"filter": pvis.pam.filter,
		"keyTime": pvis.default.timestamp,
		"keyValue": pvis.pam.value,
		"resTime": pvis.default.timestamp,
		"resValue": pvis.weight.value,
		"compare": pvis.default.compare,
		"calculate": pvis.default.calculate,
		"visualize": pvis.notes.visualize
	},
	{
		"from": pvis.pam,
		"to": "glucose",
		"key": ["tired","sleepy","gloomy"],
		"duration": 3600000,
		"offset": 0.9,
		
		"filter": pvis.pam.filter,
		"keyTime": pvis.default.timestamp,
		"keyValue": pvis.pam.value,
		"resTime": pvis.default.timestamp,
		"resValue": pvis.glucose.value,
		"compare": pvis.default.compare,
		"calculate": pvis.default.calculate,
		"visualize": pvis.glucose.visualize
	},
	{
		"from": pvis.glucose,
		"to": "food",
		"key": ">= 150",
		"duration": 7200000,
		"offset": 0.9,
		
		"filter": pvis.glucose.filter,
		"keyTime": pvis.default.timestamp,
		"keyValue": pvis.glucose.value,
		"resTime": pvis.campaign.timestamp,
		"resValue": pvis.food.value,
		"compare": pvis.default.compare,
		"calculate": pvis.default.calculate,
		"visualize": pvis.food.visualize
	}

]
