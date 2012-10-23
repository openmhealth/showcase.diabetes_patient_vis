pvis.food = {}
pvis.food.payload_id = "food";

pvis.food.fullness = [
	"Still Hungry",
	"Just Right",
	"Overfull"
];

pvis.food.value = function(v) {
	return {
		'carbCount': v.data.responses[1].value,
		'carbNote': v.data.responses[2].value,
		'fatCount': v.data.responses[3].value,
		'fatNote': v.data.responses[4].value,
		'proteinCount': v.data.responses[5].value,
		'proteinNote': v.data.responses[6].value,
		'mealPhoto': v.data.responses[7].value,
		'fullness': v.data.responses[8].value,
		'homemade': v.data.responses[9].value,
		'nonHomeMadeMealContent': v.data.responses[10].value
	};
}

pvis.food.timestamp = pvis.campaign.timestamp;

pvis.food.visualize = function(g, d, data, scale) {

	var b = new bubble(g, scale(data.res.timestamp));

	var value = data.res.value;

	var lines = [];

	['carb', 'fat', 'protein'].each(function(v) {
		var line = pvis.food.nutritionLine(v, value[v + 'Note'], value[v + 'Count'])
		if(line) {
			lines.push(line)
		}
	});

	// Put more info if nutrition facts weren't included
	if(lines.length < 3) {
		lines.push("Fullness: " + pvis.food.fullness[value.fullness])
	}

	if(lines.length < 3) {
		if(value.homemade) {
			lines.push("Homemade Meal");
		} else {
			lines.push("From: " + value.nonHomeMadeMealContent);
		}
	}

	b.addText(lines);
}

pvis.food.nutritionLine = function(title, note, count) {
	var line = ""
	if(pvis.campaign.showPrompt(note) || pvis.campaign.showPrompt(count)) {
		line = title + ":";
		if(pvis.campaign.showPrompt(count)) {
			line += " " + count + "g";
		}
		if(pvis.campaign.showPrompt(note)) {
		  line += " (" + note + ")";
		}
	}
	return line;
}

pvis.food.key_title = pvis.key_title

pvis.food.simple_vis = function(g) {
  g.each(function(d, i) {
    var parent = d3.select(this);

    var lines = 0;
    if(pvis.campaign.showPrompt(d.key.value.carbCount)) {
      parent.append("text")
        .attr("y", 18)
        .attr("text-anchor","middle")
        .text("Carbs: " + d.key.value.carbCount + "g")
        lines += 1;
    }

    if(pvis.campaign.showPrompt(d.key.value.carbNote)) {
      parent.append("text")
        .attr("y", 18)
        .attr("dy", (1.5 * lines) + "em")
        .attr("text-anchor","middle")
        .text(d.key.value.carbNote)
        lines += 1;
    }

    if(lines < 2) {
      var homemade = "Homemade";
      if(!d.key.value.homemade) {
        homemade = d.key.value.nonHomeMadeMealContent;
        if(!homemade) {
          homemade = "Eaten out"
        }
      }
      parent.append("text")
        .attr("y", 18)
        .attr("dy", (1.5 * lines) + "em")
        .attr("text-anchor","middle")
        .text(homemade)
    }

  });
}