function bubble(g, dx) {
  this.group = g.append("g")
	
	this.path = this.group.append("svg:path")
		.attr("stroke","#A2A2A2")
		.attr("fill", "#D0D0D0")
		.attr("stroke-width",1)
		.attr("dx", dx)
		.attr("filter","url(#dropshadow)")
		

	this.addText = function(lines) {

	  var text = this.group.append("text")

		lines.each(function(line, i) {
			text.append("tspan")
			.attr("x", dx)
			.attr("dy", (i) ? "1.5em" : "1em")
			.text(line);
		});
	
		text.selectAll("tspan").attr("dx","-"+text.node().getBBox().width/2);

		var noteBox=text.node().getBBox()

    var bounds = {
      "start": dx - noteBox.width/2,
      "width": noteBox.width,
      "height": noteBox.height - 15,
      "corner": 10,
      "min":0,
      "max":440
    };

    bounds.offset = 0;

    if(bounds.start<bounds.min) {
      bounds.offset = -bounds.start;
      bounds.start = bounds.min;
    } else if(bounds.start+bounds.width>bounds.max) {
      var oldstart = bounds.start;
      bounds.start = bounds.max - bounds.width
      bounds.offset = bounds.start - oldstart
    }
		
    text.selectAll("tspan").attr("x",bounds.start + bounds.width/2)
		this.path.attr("d",bubbleContainer(bounds));
		this.group.attr("transform", "translate(0," + (140 - noteBox.height) + ")");
	}
}

function bubbleContainer(x) {
	var tickWidth = 20;

  var leftSideFix = -((x.width-tickWidth)/2 - x.offset);
  if(leftSideFix < 0) leftSideFix = 0;

  var half = (x.width-tickWidth)/2
  var left = half - x.offset;
  var right = half + x.offset;

  if(left < 0) {
    right = right - left - tickWidth;
    left = 0;
  } else if(right < 0) {
    left = left - right - tickWidth;
    right = 0;
  }

	return "M " + x.start + " 0 l " + x.width + " 0 "+corner(x.corner,x.corner) 
		+ "l 0 "+ x.height + corner(-x.corner,x.corner) 
		+ "l " + -right + " 0 l -10 10 l -10 -10 l "+ -left + " 0 " + corner(-x.corner,-x.corner)
		+ "l 0 " + -x.height + corner(x.corner,-x.corner);
}

function corner(x,y) {
	return "a "+x+","+y+" 0 0,1 "+x+","+y + " "
}