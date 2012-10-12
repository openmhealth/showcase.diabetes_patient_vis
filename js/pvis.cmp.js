console.log('cmp')



var pam = {}
pam.positive = ["excited", "delighted", "happy", "glad", "calm", "satisfied", "serene", "sleepy"]
pam.negative = ["afraid", "tense", "frustrated", "angry", "miserable", "sad", "gloomy", "tired"]

pvis.cmp = [
	{
		"from": pvis.pam,
		"to": pvis.notes,
		"key": pam.positive,
		"duration": 3600000,
		"offset": 0.5,

		"compare": pvis.compare,
		"visualize": pvis.notes.visualize
	},
	{
		"from": pvis.pam,
		"to": pvis.notes,
		"key": pam.negative,
		"duration": 3600000,
		"offset": 0.5,

		"compare": pvis.compare,
		"visualize": pvis.notes.visualize
	},
	{
		"from": pvis.pam,
		"to": pvis.runkeeper,
		"key": pam.positive,
		"duration": 10800000,
		"offset": 0.9,

		"compare": pvis.runkeeper.compare,
		"visualize": pvis.runkeeper.visualize
	},
	{
		"from": pvis.pam,
		"to": pvis.food,
		"key": ["tired","sleepy"],
		"duration": 3600000,
		"offset": 0.9,

		"compare": pvis.compare,
		"visualize": pvis.food.visualize
	},
	{
		"from": pvis.pam,
		"to": pvis.sleep,
		"key": ["tired"],
		"duration": 64800000,
		"offset": 0.9,

		"compare": pvis.compare,
		"visualize": pvis.sleep.visualize
	},
	{
		"from": pvis.pam,
		"to": pvis.weight,
		"key": ["tired"],
		"duration": 64800000,
		"offset": 0.1,

		"compare": pvis.compare,
		"visualize": pvis.notes.visualize
	},
	{
		"from": pvis.pam,
		"to": pvis.glucose,
		"key": ["tired","sleepy","gloomy"],
		"duration": 3600000,
		"offset": 0.9,

		"compare": pvis.compare,
		"visualize": pvis.glucose.visualize
	},
	{
		"from": pvis.glucose,
		"to": pvis.food,
		"key": ">= 150",
		"duration": 7200000,
		"offset": 0.9,

		"compare": pvis.compare,
		"visualize": pvis.food.visualize
	}

]
