// This is an edited version of the script in Fig_10_12.html in the
// D3.js in Action book scripts!!!!


//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

// I have to call this svgLegend instead of svg.legend because d3 V4 no longer
// has an svg object underneath it.
d3.svgLegend = function() {
  var data = [];
  // This "size" variable is hard-coded and inflexible.  To avoid changing too
  // much of this code from the Fig_10_12.html script, I will simply leave it
  // as is.  However, it would have been more ideal if this were coded similar
  // to the "scale" variable below, whereby we could update our own values.
  var size = [500,20];
  // Similarly, the d3.scale.linear must be converted to d3.scaleLinear.
  var xScale = d3.scaleLinear();
  var scale;
  var title = "Legend";
  // This line below is added so that the legend font can have a class.
  var title_class = "legendTitle";
  var numberFormat = d3.format(".4n");
  var units = "Units";

  function legend(gSelection) {
      
    createLegendData(scale);
      
    var xMin = d3.min(data, function(d) {return d.domain[0]});
    var xMax = d3.max(data, function(d) {return d.domain[1]});
    xScale.domain([xMin,xMax]).range([0,size[0]])

    gSelection.selectAll("rect")
              .data(data)
              .enter()
              .append("rect")
              .attr("height", size[1])
              .attr("width", function (d) {
                 return xScale(d.domain[1]) -  xScale(d.domain[0])
               })
              .attr("x", function (d) {return xScale(d.domain[0])})
              .style("fill", function(d) {return d.color})

    gSelection.selectAll("line")
              .data(data)
              .enter()
              .append("line")
              .attr("x1", function (d) {return xScale(d.domain[0])})
              .attr("x2", function (d) {return xScale(d.domain[0])})
              .attr("y1", 0)
              .attr("y2", size[1] + 5)
              .style("stroke", "black")
              .style("stroke-width", "2px")

    gSelection.selectAll("text")
              .data(data)
              .enter()
              .append("g")
              .attr("transform", function (d) {
                 return "translate(" + (xScale(d.domain[0]))
                   + "," + (size[1] + 20) + ")"
               })
              .style("text-anchor", "middle")
              .append("text")
              .text(function(d) {return numberFormat(d.domain[0])})

    gSelection.append("text")
              // This line below is added to alter the CSS of the title
              .classed(title_class, true)
              .attr("transform", function (d) {
                 return "translate(" + (xScale(xMin))
                   + "," + (size[1] - 30) + ")"
               })
              .text(title)

    gSelection.append("text")
              .attr("transform", function (d) {
                 return "translate(" + (xScale(xMax))
                   + "," + (size[1] + 20) + ")"
               })
              .text(units)

    return legend;
  }
    
  function createLegendData(incScale) {
    var rangeArray = incScale.range();
    data = [];
      
    for (x in rangeArray) {

// FIND THE BETTER WAY TO DO THIS "TYPEOF FUNCTION" THING TO AVOID SEARCHING THROUGH THE PROTOTYPE!!!!!!!!!!!!!!!
      // This alteration below is added to prevent prototype attributes
      // from being included (like the sortBy method that was added).
      if (typeof rangeArray[x] !== 'function') {
        var colorValue = rangeArray[x];
        var domainValues = incScale.invertExtent(colorValue);
        data.push({color: colorValue, domain: domainValues})
      }
    }
  }

    
  legend.scale = function(newScale) {
    if (!arguments.length) return scale;
    scale = newScale;
    return this;
  }

  legend.title = function(newTitle) {
    if (!arguments.length) return title;
    title = newTitle;
    return this;
  }

  // This setter is to create a CSS class for the legend title
  legend.titleClass = function(newClass) {
    if (!arguments.length) return title_class;
    title_class = newClass;
    return this;
  }

  legend.unitLabel = function(newUnits) {
    if (!arguments.length) return units;
    units = newUnits;
    return this;
  }

  legend.formatter = function(newFormatter) {
    if (!arguments.length) return numberFormat;
    numberFormat = newFormatter;
    return this;
  }

  return legend;
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


