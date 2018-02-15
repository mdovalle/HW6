//'use strict';
// Be sure to mention eslint --global d3,_ clean_viz.js

!function() {
  var av = {};

  // Putting prototypes and other "dangerous" global changes at the top!
  // These clever prototype functions were found here:
  // http://stackoverflow.com/questions/14167863/
  //        how-can-i-bring-a-circle-to-the-front-with-d3
  d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
      this.parentNode.appendChild(this);
    });
  };

  d3.selection.prototype.moveToBack = function() { 
    return this.each(function() { 
      var firstChild = this.parentNode.firstChild; 
      if (firstChild) { 
        this.parentNode.insertBefore(this, firstChild); 
      } 
    }); 
  };

/*
  av.change = function () {

    // Copy-on-write since tweens are evaluated after a delay.
    var x0 = x.domain(data.sort(this.checked
        ? function(a, b) { return b.frequency - a.frequency; }
        : function(a, b) { return d3.ascending(a.letter, b.letter); })
        .map(function(d) { return d.letter; }))
        .copy();

    svg.selectAll(".bar")
        .sort(function(a, b) { return x0(a.letter) - x0(b.letter); });

    var transition = svg.transition().duration(750),
        delay = function(d, i) { return i * 50; };

    transition.selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) { return x0(d.letter); });

    transition.select(".x.axis")
        .call(xAxis)
      .selectAll("g")
        .delay(delay);
  }

*/

/**
 * Generate a Bar Plot on the browser page (no return value).
 * @function performBarplot
 * @param {Object[]} locale_data The Chicago neighborhood data.
 * @param {Object[]} nested_crime Chicago crime data, nested by neighborhood.
 */
  av.roundPretty = function(value, digits) {
    var mltplyr = Math.pow(10, digits);
    return Math.round(value / mltplyr) * mltplyr
  };

  if (typeof define === "function" && define.amd) {
    this.av = av, define(av);
  } else if (typeof module === "object" && module.exports) {
    module.exports = av;
  } else {
    this.av = av;
  }
}();

