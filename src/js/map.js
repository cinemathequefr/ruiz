/* Map */
/* Dependencies: jquery, lodash, ba-tiny-pubsub, d3, topojson, d3-queue, d3.geo.zoom (+ extra projection august) */

var map = (function () {
  var height = window.innerHeight,
      width = window.innerWidth / 2,
      scaleRange = [Math.max(width, height) * 0.333, [Math.max(width, height) * 2.5]];

  var projection = d3.geo
      .august()
      .center([0, 0])
      .rotate([60, 0, -180])
      .scale(scaleRange[0])
      .translate([(width / 2), (height / 2)]);

  var path = d3.geo.path().projection(projection);
  var zoom = d3.geo.zoom().projection(projection).scale(scaleRange[0]).scaleExtent(scaleRange);
  var svg = d3.select("svg").attr("width", width).attr("height", height);

  var world, points;

  function init() {
    world = arguments[0];
    points = arguments[1];
    run();
  }

  function run() {
    svg.append("path")
      .datum(topojson.feature(world, world.objects.land))
      .attr("class", "land")
      .attr("d", path);

    d3_queue.queue().defer(d3.xml, "img/compass.svg").awaitAll(function (error, data) {
      if (error) throw error;
      svg.node().appendChild(data[0].getElementsByTagName("svg")[0]);
    });

    svg.selectAll(".pin")
      .data(points)
      .enter()
      .append("circle")
      .attr("class", "pin")
      .attr("data-id", function (d) { return d.id; })
      // .attr("r", 9)
      .attr("r", function (d) {
        return 6 + (d.cards.length * 3); // Variable radius
      })
      .attr("transform", function (d) {
        return "translate(" + projection([ d.coordinates[0], d.coordinates[1] ]) + ")";
      })
      .each(function (d) { _.assign(d, { svg: this }) }) // Assign to each point object its corresponding svg element
      .on("click", function (d) {
        $.publish("click", d);
      });

    svg.call(zoom).call(zoom.event);
    zoom.on("zoom.redraw", zoomed);
    $.publish("ready");
  }


  function on(event, callback) {
    $.subscribe(event, callback);
  }

  function panTo(point) {
    projection.rotate(zoom.rotateTo(point.coordinates)); // https://github.com/BBC-News-Labs/newsmap/blob/master/js/utilities/zoom_functions.js#L6
    svg.transition().duration(500).call(zoom.projection(projection).event);
  }

  function zoomed() {
    svg.selectAll(".land").attr("d", path);
    svg.selectAll(".pin")
    .attr("transform", function (d) {
      return "translate(" + projection([ d.coordinates[0], d.coordinates[1] ]) + ")";
    });
  }

  return {
    init: init,
    on: on,
    panTo: panTo
  };
})();