console.log('cmp')

pvis.cmp = [
	{
		"from": pvis.pam,
		"to": pvis.notes,
		"key": pvis.pam.positive,
		"duration": 3600000,
		"offset": 0.5,

		"compare": pvis.compare
	},
	{
		"from": pvis.pam,
		"to": pvis.notes,
		"key": pvis.pam.negative,
		"duration": 3600000,
		"offset": 0.5,

		"compare": pvis.compare
	},
	{
		"from": pvis.pam,
		"to": pvis.runkeeper,
		"key": pvis.pam.positive,
		"duration": 10800000,
		"offset": 0.9,

		"compare": pvis.runkeeper.compare
	},
	{
		"from": pvis.pam,
		"to": pvis.food,
		"key": ["tired","sleepy"],
		"duration": 3600000,
		"offset": 0.9,

		"compare": pvis.compare
	},
	{
		"from": pvis.pam,
		"to": pvis.sleep,
		"key": ["tired"],
		"duration": 64800000,
		"offset": 0.9,

		"compare": pvis.compare
	},
	{
		"from": pvis.pam,
		"to": pvis.weight,
		"key": ["tired"],
		"duration": 64800000,
		"offset": 0.1,

		"compare": pvis.compare
	},
	{
		"from": pvis.pam,
		"to": pvis.glucose,
		"key": ["tired","sleepy","gloomy"],
		"duration": 3600000,
		"offset": 0.9,

		"compare": pvis.compare
	},
	{
		"from": pvis.glucose,
		"to": pvis.food,
		"key": ">= 150",
		"duration": 7200000,
		"offset": 0.9,

		"compare": pvis.compare
	}

]
