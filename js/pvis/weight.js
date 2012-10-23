pvis.weight = {}
pvis.weight.payload_id = "weight"

pvis.weight.value = function(v) {
	return v.data.weight;
}

pvis.weight.timestamp = pvis.timestamp;

pvis.weight.visualize = pvis.visualize;

pvis.weight.filter = function(v, key) {
  if(key.toLowerCase() == "any") return true;
	return eval(this.value(v) + key)
}

pvis.weight.key_title = pvis.key_title

pvis.weight.simple_vis = function(g) {
  g.each(function(d, i) {
    var parent = d3.select(this);

    parent.append("text")
      .attr("y", 18)
      .attr("text-anchor","middle")
      .text(d.key.value)

  });
}