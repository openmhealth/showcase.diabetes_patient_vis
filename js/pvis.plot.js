var width = 480,
    height = 260,
		tickheight = 10,
    margin = {top: 5, right: 20, bottom: 20, left: 20};

var chart = simpleChart()
    .width(width - margin.right - margin.left)
    .height(height - margin.top - margin.bottom);

$(window).on("resize", function() {
	resizeSVG();
});

pvis.plot = function(cmp, single, c) {

  if(single == undefined)
    single = true;

  if(c == undefined)
    c="#comparisons .container"

  chart.single = single
  
  var container = d3.selectAll(c).selectAll("svg")
      .data(cmp, function(d) { return d.from.title+d.to.title+d.key+d.duration+d.offset; });
      
	var enter = container.enter().append("svg")
	    .attr("class", "plot")
			.attr("viewBox", "0 0 " + width + " " + height)
      .attr("preserveAspectRatio", "xMinYMin");
      
  if(single) {
    enter.on("click", function(d) {
      // Show the comparison page for this comparison
      pvis.controller.onComparisonClick(d);
    });
  }

	var keyTitle = enter.append("g")
	
	keyTitle.append("rect")
			.attr("class","res")
			.attr("height", 50)
			.attr("width", width);

	var titleBack = keyTitle.append("rect")
			.attr("class", "key")
		  .attr("height", 50);
			
	var titleArrow = keyTitle.append("svg:path")
			.attr("d", function(d) { return "M 0 0 C30,35 30,15 0,50" })
			.attr("class", "key");

	var title = keyTitle.append("text")
			.attr("class", "title")
			.attr("x", 10)
			.attr("y", 35)
	    .text(function(d) { return omh.payloads[d.from.payload_id].title; });
		
	var texts = keyTitle.select("text")
	
	texts.each(function(v,i) {
			var titleLength = texts[0][i].getComputedTextLength()+20;
			d3.select(titleBack[0][i]).attr("width",titleLength)
			d3.select(titleArrow[0][i]).attr("transform", "translate(" + ((titleLength-0.5)) + ",0)")
	})
	
	var resTitle = enter.append("g")
			.attr("text-anchor", "end")
			.attr("height", "55")
	    .attr("transform", "translate(" + (width - margin.left) + "," + 0 + ")")
			
	resTitle.append("text")
			.attr("class", "title")
			.attr("y", 35)
			.text(function(d) { return omh.payloads[d.to.payload_id].title; })

	var filterTitle = enter.append("g")
			.attr("height", "23")
			.attr("transform", "translate(" + 0 + "," + 50 + ")")
							
	filterTitle.append("rect")
			.attr("class", "filter")
		  .attr("height", 23)
			.attr("width", width);
			
	filterTitle.append("text")
			.attr("y", 18)
			.attr("x", 10)
			.text(function(d) { return d.from.key_title(d.key); })

	defineFilters(enter);

	var content = enter.append("g").call(chart);
	
	content.each(function(v,i) {
			var height = content[0][i].getBBox().height;
			d3.select(container[0][i]).attr("viewBox", "0 0 " + width + " " + height)
	})
			
	container.exit().remove()

  // Sort the comparisons
  d3.selectAll(c).selectAll("svg").sort(function(d1, d2) {
    var d1from = omh.payloads[d1.from.payload_id].title;
    var d2from = omh.payloads[d2.from.payload_id].title;
    var d1to = omh.payloads[d1.to.payload_id].title;
    var d2to = omh.payloads[d2.to.payload_id].title;

    var d1 = d1from + d1to;
    var d2 = d2from + d2to;

    return d1.localeCompare(d2)
  })

	resizeSVG();
}

function resizeSVG() {
	var chart = $(".plot");
  chart.each(function(i, d) {
    $(d).attr("height", (d.viewBox.baseVal.height + 100) / d.viewBox.baseVal.width * ($(document).width() -30))
  })
}

function defineFilters(container) {

	var linearGradient = container.append("svg:defs")
		.append("svg:linearGradient")
			.attr("id", "linearGradient1")
			.attr("x1","0%")
			.attr("y1","0%")
			.attr("x2","0%")
			.attr("y2","100%")
			.attr("spreadMethod","pad");

	linearGradient.append("stop")
		.attr("offset", "0%")
		.attr("stop-color","#aaa")
		.attr("stop-opacity",1);

	linearGradient.append("stop")
		.attr("offset", "100%")
		.attr("stop-color","#666")
		.attr("stop-opacity",1);
}

function simpleChart() {
	var duration = 0,
      width = 380,
      height = 30;

  function generate(g) {
    g.each(function(d, i) {
			
      var parent = d3.select(this);

			var data = pvis.calculate.call(d, !chart.single);
			
			g = parent.selectAll("g").data(data).enter().append("g")
    			.attr("transform", function(v,i) { return "translate(" + margin.left + "," + i * 180 + ")" })
			
			// If there is no data, we just say no data
			if(!data.length) {
			  var note = parent.append("g")
			      .attr("text-anchor", "middle")
			      .attr("transform", "translate(" + (width / 2 + margin.left) + "," + height / 1.5 + ")");

				note.append("text")
					  .attr("class", "title")
					  .text("no data");
					  
					  parent.append("rect").attr("height", 305)
			      
				return;
			}

			// Add the 'from' marker line and data
			var marker = g.append("g");

			var bubble = marker.append("rect")
					.attr("height",80)
					.attr("rx",5)
					.attr("ry",5)
					.attr("fill","#A2A2A2")
			
			var bubbleContent = marker.append("g");
      bubbleContent.call(d.from.simple_vis)

			var bottom = height - margin.bottom;

      bubble.each(function(v,i) {
        var bubbleWidth = Math.max(60, bubbleContent[0][i].getBBox().width+5);
        var bubbleHeight = Math.max(30, bubbleContent[0][i].getBBox().height+5);

        d3.select(bubbleContent[0][i]).attr("transform", "translate(" + ((bubbleWidth- 60 + 10)/2) + ",5)")

        d3.select(bubble[0][i]).attr("width" ,  bubbleWidth)
        d3.select(bubble[0][i]).attr("height" ,  bubbleHeight)

        d3.select(marker[0][i]).attr("transform", "translate(" + (width * d.offset - bubbleWidth/2) + "," + 80 + ")");

        d3.select(marker[0][i]).append("svg:line")
        .attr("transform", "translate(" + bubbleWidth / 2 + ")")
        .attr("class", "marker")
        .attr("y1", bubbleHeight)
        .attr("y2", bottom - 80)

      });

      // Add the 'to' data
      g.each(function(data) {

        g = d3.select(this);
        
        var key_timestamp = data.key.timestamp.getTime()

  		  // Compute the new x-scale.
  		  var x0 = d3.time.scale()
  		      .domain([key_timestamp - (d.duration * d.offset), key_timestamp - (-d.duration * (1 -d.offset))])
  		      .range([0, width]);

  			d.to.visualize(g, d, data, x0);

        // Compute the tick format.
        var format = x0.tickFormat(8);

        // Update the tick groups.
        var tick = g.selectAll("g.tick")
            .data(x0.ticks(4));

        // Initialize the ticks with the old scale, x0.
        var tickEnter = tick.enter().append("svg:g")
            .attr("class", "tick")
            .attr("transform", translate(x0));

        tickEnter.append("svg:line")
            .attr("y1", bottom)
            .attr("y2", bottom + tickheight);

        tickEnter.append("svg:text")
            .attr("text-anchor", "middle")
            .attr("dy", "1em")
            .attr("y", bottom + tickheight)
            .text(format);
            
            g.append("svg:line")
    			      .attr("class", "xaxis")
    						.attr("x1", 0)
    						.attr("x2", width)
    						.attr("y1", bottom)
    					  .attr("y2", bottom);
      })
    });
    d3.timer.flush();
  }

  generate.width = function(x) {
    if (!arguments.length) return width;
    width = x;
    return generate;
  };

  generate.height = function(x) {
    if (!arguments.length) return height;
    height = x;
    return generate;
  };


  return generate;
};


function translate(x) {
  return function(d) {
    return "translate(" + x(d) + ",0)";
  };
}

