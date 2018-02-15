
var parm = {
    age:{
        tag: "#age", name: "Age", text: "Age"
    },
    income:{
        tag: "#income", name:"MonthlyIncome", text: "Monthly Income"
    },
    distance:{
        tag: "#distance", name:"DistanceFromHome", text: "Distance from Home"
    },
    satisfaction:{
        tag: "#satisfaction", name:"JobSatisfaction", text: "Job Satisfaction"
    }
}

var margin = {top:40, right: 40, bottom: 60, left: 60},
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

/* 
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */
var clicked = {
    x: parm[d3.select("div#x_controls")
              .selectAll("button.clicked").attr("id")],
    y: parm[d3.select("div#y_controls")
              .selectAll("button.clicked").attr("id")],
    size: parm[d3.select("div#size_controls")
              .selectAll("button.clicked").attr("id")],
    color: parm[d3.select("div#color_controls")
              .selectAll("button.clicked").attr("id")],
}

//setup x
var xValue = function(d){ return clicked.x.__data__;}, //data -> value
    xScale = d3.scaleLinear().range([0,width]) // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.axisBottom(xScale);

// setup y
var yValue = function(d) { return clicked.y.__data__;}, // data -> value
    yScale = d3.scaleLinear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.axisLeft(yScale);

// setup fill color
var colorScale = d3.scaleQuantize()
                   .range(colorbrewer['RdYlBu']['9']);
//setup size
var sizeScale = d3.scaleLinear()
                  .range([10, 50]);

//legend
var legend = d3.svgLegend().unitLabel("");

// add the graph canvas to the body of the webpage
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var showDetails = function(that) {
        var xPos = parseFloat(d3.select(that).attr("cx"));
        var yPos = parseFloat(d3.select(that).attr("cy"));
        var datum = that.__data__
      
        if (xPos > dim.tooltip.horiz_ratio * dim.width) {
          xPos = xPos - dim.tooltip.horiz_bump;
        } else {
          xPos = xPos + dim.tooltip.horiz_bump;
        }
        xPos = xPos - dim.tooltip.width / 2;
      
        if (yPos > dim.tooltip.vert_ratio * (dim.height - dim.tooltip.height)) {
          yPos = yPos - dim.tooltip.vert_bump;
        } else {
          yPos = yPos + dim.tooltip.vert_bump;
        }
        yPos = yPos + dim.tooltip.height / 2;
      
        d3.select("#tooltip")
          .style("left", xPos + "px")
          .style("top", yPos + "px");
      
        d3.select(parm.age.tag).text(datum[parm.age.name]);
        d3.select(parm.income.tag)
          .text(av.roundPretty(datum[parm.income.name], 2).toLocaleString());
        d3.select(parm.distance.tag)
          .text(+(datum[parm.distance.name] * 100).toFixed(1));
        d3.select(parm.satisfaction.tag)
          .text(+(datum[parm.satisfaction.name] * 100).toFixed(1));
      };

      var updatePoints = function(data, points, clicked) {
        xScale.domain([0, d3.max(data, function(elem) {
                return elem[clicked.x.name];
               })]);
        yScale.domain([0, d3.max(data, function(elem) {
                 return elem[clicked.y.name];
               })]);
        sizeScale.domain([0, d3.max(data, function(elem) {
                 return elem[clicked.size.name];
               })]);
        colorScale.domain([0, d3.max(data, function(elem) {
                 return elem[clicked.color.name];
               })]);
               svg.select("#xAxis")
               .transition("updating")
               .duration(600)
               .call(xAxis);
            svg.select("#xLabel")
               .transition("updating")
               .duration(600)
               .text(clicked.x.text);
          
            svg.select("#yAxis")
               .transition("updating")
               .duration(600)
               .call(yAxis);
            svg.select("#yLabel")
               .transition("updating")
               .duration(600)
               .text(clicked.y.text);
          
        svg.select("#legend").remove();
          
        svg.append("g")
           .attr("transform", "translate(0, " + (500 - 20) + ")")
           .attr("id", "legend")
          
            svg.select("#legend")
               .call(legend.scale(colorScale).title(clicked.color.text).formatter(colorScale.tickFormat()))
          
            points.transition("updating")
                  .duration(600)
                  .delay(function(d, idx) { return idx * 20; })
                  .attr('cx', function(elem) {
                     return xScale(elem[clicked.x.name]);
                   })
                  .attr('cy', function(elem) {
                     return yScale(elem[clicked.y.name]);
                   })
                  .attr('r', function(elem) {
                     return sizeScale(elem[clicked.size.name]);
                   })
                  .style('fill', function(elem) {
                     return colorScale(elem[clicked.color.name]);
                   })
                  .text(function(elem) {
                     return clicked.y.text + ": " + elem[clicked.y.name];
                   });        
          };
             
// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

//load data
d3.csv("age_df.csv", function(error, data){
    //change string from csv into number format
    if (error) { console.log(error); 
    } else {
    data.forEach(function(d){
        d.Age = +d.Age;
        d.DistanceFromHome = +d.DistanceFromHome;
        d.JobSatisfaction = +d.JobSatisfaction;
        d.MonthlyIncome = +d.MonthlyIncome;

    console.log(d);
    });

xScale.domain([d3.min(data, xValue), d3.max(data, xValue)]);
yScale.domain([d3.min(data, yValue), d3.max(data, yValue)]);

//x-axis
svg.append("g")
.attr("class", "xAxis")
.attr("transform", "translate(0," + height + ")")
.call(xAxis)
.append("text")
.attr("class", "xLabel")
.attr("x", width)
//.attr("y", -6)
.style("text-anchor", "end")
//.text("Age");

// y-axis
svg.append("g")
.attr("class", "yAxis")
.call(yAxis)
.append("text")
.attr("class", "yLabel")
.attr("transform", "rotate(-90)")
.attr("y", 6)
.style("text-anchor", "end")
//.text("Monthly Income");

// draw circles
var points = svg.selectAll("circle")
.data(data)
.enter().append("circle").classed('point', true)
.attr("r", 3.5)
.style("stroke", "black")
//.style("fill", function(d) { return color(d.DistanceFromHome);}) 
;
updatePoints(data, points, clicked);

points.on("mouseover", function(d) {
    tooltip.transition()
         .duration(200)
         .style("opacity", .9);
    tooltip.html("Distance from Home: " + d.DistanceFromHome + " miles" + "<br/> (" + 
    "Age: " + (d.Age) + ", Income: " +(d.MonthlyIncome) + ")")
         .style("left", (d3.event.pageX + 5) + "px")
         .style("top", (d3.event.pageY - 28) + "px");
})
.on("mouseout", function(d) {
    tooltip.transition()
         .duration(500)
         .style("opacity", 0);
});


d3.select("div#x_controls").selectAll("button")
.on("click", function() {
   d3.select("div#x_controls").selectAll("button")
     .classed("clicked", false);
   d3.select(this).classed("clicked", true);
   clicked.x = _.find(parm, {'tag': '#' + this.id});
   updatePoints(data, points, clicked);
 });
d3.select("div#y_controls").selectAll("button")
.on("click", function() {
   d3.select("div#y_controls").selectAll("button")
     .classed("clicked", false);
   d3.select(this).classed("clicked", true);
   clicked.y = _.find(parm, {'tag': '#' + this.id});
   updatePoints(data, points, clicked);
 });
d3.select("div#size_controls").selectAll("button")
.on("click", function() {
   d3.select("div#size_controls").selectAll("button")
     .classed("clicked", false);
   d3.select(this).classed("clicked", true);
   clicked.size = _.find(parm, {'tag': '#' + this.id});
   updatePoints(data, points, clicked);
 });
d3.select("div#color_controls").selectAll("button")
.on("click", function() {
   d3.select("div#color_controls").selectAll("button")
     .classed("clicked", false);
   d3.select(this).classed("clicked", true);
   clicked.color = _.find(parm, {'tag': '#' + this.id});
   updatePoints(data, points, clicked);
 });
    }

});
