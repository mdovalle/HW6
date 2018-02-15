'use strict';
// Be sure to mention eslint --global d3,_ clean_viz.js

/**
 * Generate a Bar Plot on the browser page (no return value).
 * @function performBarplot
 * @param {Object[]} locale_data The Chicago neighborhood data.
 * @param {Object[]} nested_crime Chicago crime data, nested by neighborhood.
 */
var performBarplot = function(locale_data, nested_crime) {
  var width = 800;
  var height = 500;
  var padding = 30;

  var xScale = d3.scaleLinear().domain([0, 78])
                 .range([padding, width - padding]);
  var yScale = d3.scaleLinear().domain([0, 10])
                 .range([height - padding, padding]);
  var barWidth = Math.floor((width - 2 * padding) / 78);
  var yAxis = d3.axisLeft(yScale);
  var svg = d3.select("div#viz").append("svg")
                                .attr("width", width)
                                .attr("height", height);
  svg.append("text")
     .classed("title", true)
     .attr("id", "title-headline")
     .attr("x", width / 2)
     .attr("y", padding)
     .text("Number of Arrests (Out of 10)");
  svg.append("text")
     .classed("title", true)
     .attr("x", width / 2)
     .attr("y", 2 * padding)
     .text("by Neighborhood");

  svg.selectAll('rect')
     .data(nested_crime)
     .enter()
     .append('rect')
     .attr('width', barWidth)
     .attr('x', function(elem, idx) {
       return xScale(idx);
     })
     .attr('y', function(elem) {
       return yScale(elem.Arrests);
     })
     .attr('height', function(elem) {
       return height - yScale(elem.Arrests);
     });
  svg.append("g").attr("class", "axis")
                 .attr("transform", "translate(" + padding + ",0)")
                 .call(yAxis);
};

/**
 * @typedef LocaleCrime
 * @type Object
 * @property {Object} locale_data The neighborhood statistical data
 * @property {Object} nested_crime The crime data, nested by neighborhood
 */

/**
 * Organize the incoming Chicago Crime data, into a form more
 * friendly to consumption by the D3 infrastructure.
 * @function orgdata
 * @param {Object[]} incoming_data Chicago Crime data, read from d3.json
 * @returns {LocaleCrime}
 *          Object with neighborhood and nested crime data properly organized.
 */
var orgData = function(incoming_data) {
  // Be sure to add some JSDoc comments!!!
  var crime_data = _.map(incoming_data, function(elem) {
        return _.pick(elem, 'CA Name', 'Primary Type', 'Arrest');
      });
  var locale_data = _.map(incoming_data, function(elem) {
        return _.pick(elem, 'CA Name', 'Area Per Capita Income',
          'Area Prop Age>16 Unemployed', 'Area Prop Households Below Poverty',
          'Hardship Index');
      });
  var nested_crime = d3.nest().key(function(elem) {
        return elem['CA Name'];
      })
      .entries(crime_data);
  nested_crime.forEach(function(elem) {
      elem.Arrests = elem.values.reduce(function(frst, scd) {
        return {'Arrest': frst.Arrest + scd.Arrest};
      })
      .Arrest;
    });
  locale_data = _.uniqBy(locale_data, function (elem) {
      return elem['CA Name'];
    });

  return {
    'locale_data': locale_data,
    'nested_crime': nested_crime
  };
};

/** The equivalent to 'main', the main code launch for our program. */
d3.json("../data/mini_Chicago_crime_records.json",
        function(error, data) {
  if (error) {
    console.log(error);
  } else {
    var data_dict = orgData(data);
    performBarplot(data_dict.locale_data, data_dict.nested_crime);
  }
});
