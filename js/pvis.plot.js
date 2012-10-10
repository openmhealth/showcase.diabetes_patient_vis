var width = 480,
    height = 260,
		tickheight = 10,
    margin = {top: 5, right: 20, bottom: 20, left: 20},
		aspect = width / height;

var chart = simpleChart()
    .width(width - margin.right - margin.left)
    .height(height - margin.top - margin.bottom);

$(window).on("resize", function() {
	resizeSVG();
});

pvis.plot = function(cmp) {

	var container = d3.select("#container").selectAll("svg")
	    .data(cmp);
			
	var enter = container.enter().append("svg")
	    .attr("class", "plot")
			.attr("viewBox", "0 0 " + width + " " + height)
			.attr("preserveAspectRatio", "xMinYMin");

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
	
	var titleLength = title.node().getComputedTextLength();
	
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
			.text(function(d) { return omh.payloads[d.to].title; })

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

	defineFilters(container);

	container.append("g")
			.attr("transform", "translate(" + margin.left + ",0)")
			.call(chart);

	resizeSVG();
}

function resizeSVG() {
	var chart = $(".plot");
  var targetWidth = chart.parent().width();
  chart.attr("width", targetWidth);
  chart.attr("height", targetWidth / aspect);
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
			
      g = d3.select(this);
			
			var data = d.calculate();

			if(!data) {
				// If there is no data, we just say no data
			  var note = g.append("g")
			      .attr("text-anchor", "middle")
			      .attr("transform", "translate(" + width / 2 + "," + height / 1.5 + ")");

				note.append("text")
					  .attr("class", "title")
					  .text("no data");
				return;
			}
			
			var key_timestamp = data.key.timestamp.getTime()
			
		  // Compute the new x-scale.
		  var x0 = d3.time.scale()
		      .domain([key_timestamp - (d.duration * d.offset), key_timestamp - (-d.duration * (1 -d.offset))])
		      .range([0, width]);

			// Add the pam marker line
			var marker = g.selectAll("marker")
					.data([d])
				.enter().append("g");

			var bubble = marker.append("rect")
					.attr("height",80)
					.attr("rx",5)
					.attr("ry",5)
					.attr("fill","#A2A2A2")
			
			var bubbleContent = marker.append("g")

			var bottom = height - margin.bottom;


			if(d.from.payload_id == "pam") {
			bubbleContent.append("image")
					.attr("width",50)
					.attr("height",50)
					.attr("xlink:href", "images/pam/"+data.key.value.photo_id+"_"+data.key.value.mood+"/"+data.key.value.photo_id+"_"+data.key.value.sub_photo_id+".jpg");
			
			var key = bubbleContent.append("text")
					.attr("y", 70)
					.attr("x", 25)
					.attr("text-anchor","middle")
					.text(data.key.value.mood)
				
			var titleLength = Math.max(60, key.node().getComputedTextLength());
			
			bubbleContent.attr("transform", "translate(" + ((titleLength- 60 + 10)/2) + ",5)")
			bubble.attr("width" ,  titleLength)
			
			
			bubbleWidth= bubble.node().getBBox().width;

			marker.attr("transform", function(d) { return "translate(" + (width * d.offset - bubbleWidth/2) + "," + 80 + ")";});

			marker.append("svg:line")
					.attr("transform", "translate(" + bubbleWidth / 2 + ")")
			    .attr("class", "marker")
			    .attr("y1", 76)
			    .attr("y2", bottom - 80)

			} else {

				bubble.attr("height",30)
				var key = bubbleContent.append("text")
						.attr("y", 18)
						.attr("x", 25)
						.attr("text-anchor","middle")
						.text(data.key.value.glucose)
				
				var titleLength = Math.max(60, key.node().getComputedTextLength());
			
				bubbleContent.attr("transform", "translate(" + ((titleLength- 60 + 10)/2) + ",5)")
				bubble.attr("width" ,  titleLength)
			
			
				bubbleWidth= bubble.node().getBBox().width;

				marker.attr("transform", function(d) { return "translate(" + (width * d.offset - bubbleWidth/2) + "," + 80 + ")";});

				marker.append("svg:line")
						.attr("transform", "translate(" + bubbleWidth / 2 + ")")
				    .attr("class", "marker")
				    .attr("y1", 26)
				    .attr("y2", bottom - 80)
				
			}
			

			d.visualize(g, d, data, x0);

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

