function bubble(g, dx) {
  this.group = g.append("g")
	
	this.path = this.group.append("svg:path")
		.attr("stroke","#A2A2A2")
		.attr("fill", "#D0D0D0")
		.attr("stroke-width",1)
		.attr("dx", dx)

	this.addText = function(lines) {

	  var text = this.group.append("text")

		lines.each(function(line, i) {
			console.log(i)
			text.append("tspan")
			.attr("x", dx)
			.attr("dy", (i) ? "1.5em" : "1em")
			.text(line);
		});
	
		text.selectAll("tspan").attr("dx","-"+text.node().getBBox().width/2);

		var noteBox=text.node().getBBox()
			
		this.path.attr("d",bubbleContainer( {
			"start": dx - noteBox.width/2,
			"width": noteBox.width,
			"height": noteBox.height - 15,
			"corner": 10
			})
		);
		
		this.group.attr("transform", "translate(0," + (200 - noteBox.height) + ")");	
	}
}

function bubbleContainer(x) {
	var tickWidth = 20;
	return "M " + x.start + " 0 l " + x.width + " 0 "+corner(x.corner,x.corner) 
		+ "l 0 "+ x.height + corner(-x.corner,x.corner) 
		+ "l -" + ((x.width-tickWidth)/2) + " 0 l -10 10 l -10 -10 l -"+ ((x.width-tickWidth)/2) + " 0 " + corner(-x.corner,-x.corner) 
		+ "l 0 -" + x.height + corner(x.corner,-x.corner);
}

function corner(x,y) {
	return "a "+x+","+y+" 0 0,1 "+x+","+y + " "
}