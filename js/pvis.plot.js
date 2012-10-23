var width = 480,
    height = 175,
		tickheight = 10,
    margin = {top: 5, right: 20, bottom: 20, left: 20};

var chart = simpleChart()
    .width(width - margin.right - margin.left)
    .height(height);

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
      .data(cmp, function(d) {
				return d.from.payload_id+d.to.payload_id+d.key+d.duration+d.offset;
			});

	container.exit().remove();

	// Add the svg object
	var enter = container.enter().append("svg")
	    .attr("class", "plot")
			.attr("viewBox", "0 0 " + width + " " + height)
      .attr("preserveAspectRatio", "xMinYMin");

	// If we are looking at a single comparison, we should be able to click it to view all
  if(single) {
    container.on("click", function(d) {
      // Show the comparison page for this comparison
      pvis.controller.onComparisonClick(d);
    });
  }

	// Define some filters which are used by the svg object
  var defs = enter.append("svg:defs");

	var linearGradient = defs.append("svg:linearGradient")
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

  var dropshadow = defs.append("svg:filter")
	  .attr("id", "dropshadow")
	  .attr("height","120%")

  dropshadow.append("feGaussianBlur")
    .attr("in", "SourceAlpha")
    .attr("stdDeviation",3)

  dropshadow.append("feOffset")
    .attr("dx",2)
    .attr("dy",2)
    .attr("result","offsetblur")

  dropshadow.append("feComponentTransfer")
    .append("feFuncA")
    .attr("type","linear")
    .attr("slope",0.2)

  var merge = dropshadow.append("feMerge");
  merge.append("feMergeNode")
 
  merge.append("feMergeNode")
    .attr("in","SourceGraphic")

	// Draw the 'from' title
	var keyTitle = enter.append("g")

	keyTitle.append("rect")
		.attr("class","res")
		.attr("height", 50)
		.attr("width", width);

	var titleArrow = keyTitle.append("svg:path")
		.attr("class", "key")
		.attr("filter","url(#dropshadow)")

	var title = keyTitle.append("text")
		.attr("class", "title")
		.attr("x", 10)
		.attr("y", 35)
    .text(function(d) { return omh.payloads[d.from.payload_id].title; });

	title.each(function(v,i) {
			var titleLength = title[0][i].getComputedTextLength()+20;
			d3.select(titleArrow[0][i]).attr("d", "M 0 0 l "+ titleLength +" 0 c30,35 30,15 0,50 L 0 50")
	})

	// Draw the 'to' title
	keyTitle.append("g")
			.attr("text-anchor", "end")
	    .attr("transform", "translate(" + (width - margin.left) + "," + 0 + ")")
		.append("text")
			.attr("class", "title")
			.attr("y", 35)
			.text(function(d) { return omh.payloads[d.to.payload_id].title; })

	// Draw the key filter
	var filterTitle = keyTitle.append("g")
		.attr("height", "23")
		.attr("transform", "translate(" + 0 + "," + 50 + ")");
	filterTitle.append("rect")
		.attr("class", "filter")
		.attr("height", 23)
		.attr("width", width)
               .attr("filter","url(#dropshadow)");
	filterTitle.append("text")
		.attr("y", 18)
		.attr("x", 10)
		.text(function(d) { return d.from.key_title(d.key); });

	// Add the initial content and set the height
	var content = enter.append("g")
		.attr("class", "content")

	var content = container.select(".content").call(chart);

	content.each(function(v,i) {
		var height = Math.max(content[0][i].getBBox().height, 190) - 15;
		d3.select(container[0][i]).attr("viewBox", "0 0 " + width + " " + height)
	});

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

	// Resize the svg areas so they fit the window now that we plotted the data
	resizeSVG();
}

function resizeSVG() {
	var chart = $(".plot");
  chart.each(function(i, d) {
    $(d).attr("height", (d.viewBox.baseVal.height + 100) / d.viewBox.baseVal.width * ($(document).width() -30))
  })
}

function simpleChart() {
	var duration = 0,
      width = 380,
      height = 30;

  function generate(g) {
    g.each(function(d, i) {

      var parent = d3.select(this);
      var data = pvis.calculate.call(d, !chart.single);

      var content = parent.selectAll(".comp").data(data, function(dt,i) {
        if(dt.res)
          return dt.res.timestamp + dt.key.timestamp;
        });
      content.exit().transition().attr('opacity',0).remove();
      var enter = content.enter().append("g").attr("class","comp")
        .attr("transform", function(v,i) { return "translate(" + margin.left + "," + (80 + (i*200)) + ")";});


      enter.attr('opacity',0).transition().attr('opacity',1)

      var bubbleContainer = enter.append("g");

      var bubble = bubbleContainer.append("rect")
        .attr("height",80)
        .attr("stroke","#A2A2A2")
        .attr("stroke-width",1)
        .attr("rx",5)
        .attr("ry",5)
        .attr("fill","lightsteelblue")

      var bubbleContent = bubbleContainer.append("g");
      bubbleContent.call(d.from.simple_vis)

      var bottom = height - margin.bottom;

      // Align the 'from' data
      bubble.each(function(v,i) {
        var bubbleWidth = Math.max(60, bubbleContainer[0][i].getBBox().width+5);
        var bubbleHeight = Math.max(30, bubbleContainer[0][i].getBBox().height+5);

        d3.select(bubbleContent[0][i]).attr("transform", "translate(" + bubbleWidth/2 + ",4)")

        d3.select(bubble[0][i])
          .attr("width" ,  bubbleWidth)
          .attr("height" ,  bubbleHeight)

        d3.select(bubbleContainer[0][i]).attr("transform", "translate(" + (width * d.offset - bubbleWidth/2) + ")");

        d3.select(bubbleContainer[0][i]).append("svg:line")
          .attr("transform", "translate(" + bubbleWidth / 2 + ")")
          .attr("class", "marker")
          .attr("y1", bubbleHeight)
          .attr("y2", bottom)
      });

      // Add the 'to' data
      enter.each(function(data) {

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

			// Show no data if there is nothing
			if(!data.length) {
				console.log(height)
				parent.append("g")
						.attr("class", "comp")
						.attr("text-anchor", "middle")
						.attr("transform", "translate(" + ((width / 2) + margin.left) + "," + height + ")")
					.append("text")
						.attr("class", "title")
						.text("no data");
			}

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

