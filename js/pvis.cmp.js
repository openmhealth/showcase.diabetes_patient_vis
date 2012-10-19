console.log('cmp')

pvis.cmp = [
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
		"duration": 3600000,
		"offset": 0.9,

		"compare": pvis.compare
	},
	{
		"from": pvis.glucose,
		"to": pvis.food,
		"key": "<= 120",
		"duration": 3600000,
		"offset": 0.9,

		"compare": pvis.compare
	}
]

pvis.explorer = [
	// pam

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
		"to": pvis.notes,
		"key": pvis.pam.positive,
		"duration": 3600000,
		"offset": 0.5,

		"compare": pvis.compare
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
		"to": pvis.runkeeper,
		"key": pvis.pam.positive,
		"duration": 10800000,
		"offset": 0.9,

		"compare": pvis.runkeeper.compare
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
		"from": pvis.pam,
		"to": pvis.sleep,
		"key": pvis.pam.positive,
		"duration": 64800000,
		"offset": 0.9,

		"compare": pvis.compare
	},
	{
		"from": pvis.pam,
		"to": pvis.sleep,
		"key": pvis.pam.negative,
		"duration": 64800000,
		"offset": 0.9,

		"compare": pvis.compare
	},

	// glucose

	{
		"from": pvis.glucose,
		"to": pvis.pam,
		"key": "Any",
		"duration": 3600000,
		"offset": 0.5,

		"compare": pvis.compare,
		"filter": function(v) {return true;}
	},
	{
		"from": pvis.glucose,
		"to": pvis.food,
		"key": "Any",
		"duration": 3600000,
		"offset": 0.9,

		"compare": pvis.compare
	},
	{
		"from": pvis.glucose,
		"to": pvis.food,
		"key": ">= 150",
		"duration": 3600000,
		"offset": 0.9,

		"compare": pvis.compare
	},
	{
		"from": pvis.glucose,
		"to": pvis.food,
		"key": "<= 120",
		"duration": 3600000,
		"offset": 0.9,

		"compare": pvis.compare
	},
	{
		"from": pvis.glucose,
		"to": pvis.notes,
		"key": ">= 150",
		"duration": 3600000,
		"offset": 0.5,

		"compare": pvis.compare
	},
	{
		"from": pvis.glucose,
		"to": pvis.notes,
		"key": "<= 100",
		"duration": 3600000,
		"offset": 0.5,

		"compare": pvis.compare
	},
	{
		"from": pvis.glucose,
		"to": pvis.runkeeper,
		"key": "Any",
		"duration": 3600000,
		"offset": 0.9,

		"compare": pvis.runkeeper.compare
	},
	{
		"from": pvis.glucose,
		"to": pvis.sleep,
		"key": "Any",
		"duration": 64800000,
		"offset": 0.9,

		"compare": pvis.compare
	},
	{
		"from": pvis.glucose,
		"to": pvis.weight,
		"key": "Any",
		"duration": 64800000,
		"offset": 0.1,

		"compare": pvis.compare
	},

	// food

	{
		"from": pvis.food,
		"to": pvis.pam,
		"key": "Eating out",
		"duration": 3600000,
		"offset": 0.5,

		"compare": pvis.compare,
		"filter": function(v) {return !this.value(v).homemade;}
	},
	{
		"from": pvis.food,
		"to": pvis.glucose,
		"key": "Any",
		"duration": 3600000,
		"offset": 0.1,

		"compare": pvis.compare,
		"filter": function(v) {return true;}
	},
	{
		"from": pvis.food,
		"to": pvis.sleep,
		"key": "Any",
		"duration": 64800000,
		"offset": 0.5,

		"compare": pvis.compare,
		"filter": function(v) {return true;}
	},

	// runkeeper

	{
		"from": pvis.runkeeper,
		"to": pvis.notes,
		"key": "duration > 20 minutes",
		"duration": 32400000,
		"offset": 0.1,

		"compare": pvis.compare
	}
]